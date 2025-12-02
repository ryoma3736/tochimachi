# 認証システム - とちまち

## 概要

NextAuth.jsを使用した3種類のユーザーロール（顧客・業者・管理者）対応の認証システム。

## 技術スタック

- **NextAuth.js**: 認証フレームワーク
- **bcryptjs**: パスワードハッシュ化
- **Prisma**: データベースアクセス
- **JWT**: セッション管理

## ユーザーロール

| ロール | 説明 | 認証方法 |
|--------|------|---------|
| **customer** | 一般顧客 | Email/Password + Google OAuth |
| **vendor** | 業者（300社限定） | Email/Password（審査制） |
| **admin** | 管理者 | Email/Password |

## セットアップ

### 1. 環境変数の設定

`.env.local`ファイルを作成し、以下の変数を設定してください：

```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (Optional - for customer login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. NEXTAUTH_SECRETの生成

```bash
openssl rand -base64 32
```

### 3. データベースのセットアップ

```bash
# Prisma migration実行
npm run db:migrate

# (Optional) シードデータ投入
npm run db:seed
```

### 4. 開発サーバー起動

```bash
npm run dev
```

## APIエンドポイント

### NextAuth.js

- **GET/POST** `/api/auth/[...nextauth]` - NextAuth認証ハンドラー

### 顧客登録

- **POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "山田 太郎",
  "email": "customer@example.com",
  "password": "password123",
  "phone": "090-1234-5678",
  "prefecture": "宇都宮市"
}
```

**Response (201):**
```json
{
  "message": "登録が完了しました",
  "user": {
    "id": "uuid",
    "name": "山田 太郎",
    "email": "customer@example.com"
  }
}
```

### 業者登録

- **POST** `/api/auth/vendor/register`

**Request Body:**
```json
{
  "companyName": "株式会社とちまち",
  "email": "vendor@example.com",
  "password": "password123",
  "categoryId": "uuid",
  "contactPhone": "028-1234-5678",
  "address": "栃木県宇都宮市XXX町1-2-3"
}
```

**Response (201):**
```json
{
  "message": "登録申請を受け付けました。審査完了後、ログイン可能となります。",
  "vendor": {
    "id": "uuid",
    "companyName": "株式会社とちまち",
    "email": "vendor@example.com",
    "category": "建設業"
  }
}
```

## ページルート

### 認証ページ

- `/login` - ログインページ（顧客・業者・管理者共通）
- `/register` - 顧客登録ページ
- `/vendor/register` - 業者登録ページ
- `/vendor/register/pending` - 業者登録完了（審査待ち）ページ

### 保護されたルート

#### 顧客専用
- `/inquiry` - 問い合わせ管理
- `/profile` - プロフィール編集

#### 業者専用
- `/vendor/dashboard` - ダッシュボード
- `/vendor/profile` - プロフィール編集
- `/vendor/services` - サービス管理
- `/vendor/inquiries` - 問い合わせ対応

#### 管理者専用
- `/admin` - 管理画面

## 認証フロー

### 顧客登録フロー

```
1. /register でアカウント作成
   ↓
2. Email/Passwordまたは Google OAuth でログイン
   ↓
3. 即座に全機能利用可能
```

### 業者登録フロー

```
1. /vendor/register で登録申請
   ↓
2. 管理者による審査（approvedAt: null → DateTime）
   ↓
3. 審査完了通知メール送信
   ↓
4. /login でログイン可能（vendor role）
   ↓
5. プロフィール完成・サービス登録
```

### 管理者ログイン

```
1. データベースに直接管理者アカウント作成
   ↓
2. /login でログイン（admin role選択）
   ↓
3. 管理画面アクセス可能
```

## セッション管理

- **Strategy**: JWT
- **Max Age**: 30日
- **Token保存場所**: HTTPOnly Cookie

## セキュリティ

### パスワード要件

- 最小8文字
- bcryptでハッシュ化（salt rounds: 12）

### ミドルウェア保護

`middleware.ts`がロールベースアクセス制御を実行：

- 未認証ユーザー → `/login`にリダイレクト
- 無効なアカウント → ログイン拒否
- 権限不足 → `/login`にリダイレクト

### 環境変数

- `NEXTAUTH_SECRET`: JWT署名に使用（必須）
- パスワードハッシュはデータベースに保存
- Google OAuthトークンはNextAuthが管理

## 使用例

### サーバーサイドでセッション取得

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <div>Welcome, {session.user.name}</div>;
}
```

### クライアントサイドでセッション取得

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please login</div>;

  return <div>Welcome, {session.user.name}</div>;
}
```

### ロールチェック

```tsx
import { hasRole } from "@/lib/auth";

if (!hasRole(session.user, ["vendor", "admin"])) {
  return <div>Access Denied</div>;
}
```

## トラブルシューティング

### ログインできない

1. `NEXTAUTH_SECRET`が設定されているか確認
2. データベース接続が正常か確認
3. Prisma Clientが最新か確認（`npm run db:generate`）

### 業者がログインできない

1. `approvedAt`がnullでないか確認（審査完了済みか）
2. `isActive`がtrueか確認

### Google OAuthでエラー

1. `GOOGLE_CLIENT_ID`と`GOOGLE_CLIENT_SECRET`が正しいか確認
2. Google Cloud Consoleで承認済みリダイレクトURIに`http://localhost:3000/api/auth/callback/google`が追加されているか確認

## テスト

```bash
# 認証APIテスト
npm run test -- auth

# E2Eテスト
npm run test:e2e -- auth-flow
```

## 今後の拡張

- [ ] パスワードリセット機能
- [ ] メール認証
- [ ] 2要素認証（2FA）
- [ ] ソーシャルログイン拡張（Twitter, Facebook）
- [ ] 業者審査自動化
- [ ] アカウント削除機能

## 参考リンク

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
