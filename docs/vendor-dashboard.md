# 業者管理ダッシュボード

Issue #11 の実装内容

## 概要

業者（Vendor）向けの管理ダッシュボード機能を実装しました。業者は自社のプロフィール、サービス、問い合わせ、Instagram連携、課金情報を管理できます。

## 実装したページ

### 1. ダッシュボードホーム (`/vendor/dashboard`)

**機能:**
- 今月の問い合わせ数
- プロフィール閲覧数
- 課金ステータス (¥120,000/月)
- 成約率
- クイックアクション（サービス追加、プロフィール編集など）
- 最近の問い合わせ一覧

**ファイル:**
- `/app/vendor/dashboard/page.tsx`

### 2. プロフィール管理 (`/vendor/profile`)

**機能:**
- 基本情報編集
  - 会社名、カテゴリ、電話番号、住所、ウェブサイトURL、会社説明
- 詳細情報
  - 営業時間設定（曜日別）
  - 対応エリア選択（栃木県の各市）
- 画像管理
  - 会社ロゴアップロード
  - カバー画像アップロード
  - ギャラリー画像（最大20枚）

**ファイル:**
- `/app/vendor/profile/page.tsx`

### 3. サービス管理 (`/vendor/services`)

**機能:**
- サービス一覧表示
- サービス追加
  - サービス名、カテゴリ、説明、料金、単位
- サービス編集
- サービス削除（確認ダイアログあり）
- 公開/非公開の切り替え
- ドラッグ&ドロップでの並び替え（UI実装済み）

**ファイル:**
- `/app/vendor/services/page.tsx`

### 4. 問い合わせ管理 (`/vendor/inquiries`)

**機能:**
- 問い合わせ一覧
  - すべて/未対応/返信済み/完了のタブ切り替え
  - ステータス別集計表示
- 問い合わせ詳細 (`/vendor/inquiries/[id]`)
  - お客様情報表示
  - 問い合わせ内容表示
  - 返信機能
  - 内部メモ機能
  - クイックアクション（メール、電話、見積書作成）

**ファイル:**
- `/app/vendor/inquiries/page.tsx`
- `/app/vendor/inquiries/[id]/page.tsx`

### 5. Instagram連携 (`/vendor/instagram`)

**機能:**
- 連携ステータス表示
- Instagram連携/解除ボタン
- 投稿の手動同期
- 連携設定
  - 自動同期の有効/無効
  - プロフィール表示の有効/無効
  - 表示する投稿数の設定
- 投稿一覧表示
  - グリッドレイアウト
  - いいね数、コメント数表示

**ファイル:**
- `/app/vendor/instagram/page.tsx`

### 6. 課金管理 (`/vendor/billing`)

**機能:**
- 現在のプラン表示（スタンダードプラン: ¥120,000/月）
- プランに含まれる内容の表示
- 次回請求日表示
- お支払い方法表示
  - クレジットカード情報（マスク表示）
  - 支払い方法の変更ボタン
- 統計情報
  - 今月の請求額
  - 年間支払額
  - 利用開始日
- 支払い履歴
  - 日付、ステータス、金額
  - 領収書ダウンロードボタン

**ファイル:**
- `/app/vendor/billing/page.tsx`

## レイアウトとナビゲーション

### サイドバーナビゲーション (`/vendor/layout.tsx`)

**機能:**
- 固定サイドバー（幅: 256px）
- ロゴとブランド名表示
- 各ページへのナビゲーションリンク
  - ダッシュボード
  - プロフィール管理
  - サービス管理
  - 問い合わせ管理
  - Instagram連携
  - 課金管理
- フッターにユーザー情報表示

**ファイル:**
- `/app/vendor/layout.tsx`

## 共通コンポーネント

### StatCard (`/components/vendor/StatCard.tsx`)

統計情報を表示するカードコンポーネント

**Props:**
- `title`: カードタイトル
- `value`: 表示値
- `icon`: アイコン（Lucide React）
- `trend`: トレンド情報（オプション）
  - `value`: 変化率（%）
  - `label`: ラベル（例: "先月比"）
  - `isPositive`: プラス/マイナスの色分け

### QuickActions (`/components/vendor/QuickActions.tsx`)

クイックアクションボタンのグリッド表示

**機能:**
- サービス追加
- プロフィール編集
- 問い合わせ対応
- レポート確認

### RecentInquiries (`/components/vendor/RecentInquiries.tsx`)

最近の問い合わせを3件表示

**機能:**
- お客様名、サービス、ステータス、日付の表示
- ステータスバッジ（未対応/返信済み/完了）
- 詳細ページへのリンク
- "すべて表示"ボタン

## 技術スタック

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Radix UI)
- **Lucide React** (アイコン)
- **Prisma** (データベースORM)

## データモデル連携

Prismaスキーマの以下のモデルと連携:

- `Vendor` - 業者情報
- `VendorProfile` - 業者プロフィール詳細
- `Service` - サービス・料金メニュー
- `Inquiry` - 問い合わせ
- `InquiryItem` - 問い合わせ明細
- `Subscription` - 課金情報
- `InstagramAccount` - Instagram連携情報

## 今後の実装予定

### バックエンド統合

現在はモックデータを使用していますが、以下のAPIエンドポイントを実装する必要があります:

1. **認証・セッション管理**
   - `/api/vendor/auth/login`
   - `/api/vendor/auth/logout`
   - `/api/vendor/auth/session`

2. **ダッシュボード**
   - `/api/vendor/dashboard/stats`

3. **プロフィール管理**
   - `GET /api/vendor/profile`
   - `PUT /api/vendor/profile`
   - `POST /api/vendor/profile/upload`

4. **サービス管理**
   - `GET /api/vendor/services`
   - `POST /api/vendor/services`
   - `PUT /api/vendor/services/:id`
   - `DELETE /api/vendor/services/:id`

5. **問い合わせ管理**
   - `GET /api/vendor/inquiries`
   - `GET /api/vendor/inquiries/:id`
   - `POST /api/vendor/inquiries/:id/reply`
   - `PUT /api/vendor/inquiries/:id/memo`

6. **Instagram連携**
   - `GET /api/vendor/instagram/status`
   - `POST /api/vendor/instagram/connect`
   - `DELETE /api/vendor/instagram/disconnect`
   - `POST /api/vendor/instagram/sync`

7. **課金管理**
   - `GET /api/vendor/billing/subscription`
   - `GET /api/vendor/billing/history`
   - `PUT /api/vendor/billing/payment-method`

### 機能拡張

- 画像アップロード機能の実装（AWS S3 or Cloudinary）
- ドラッグ&ドロップ並び替えの実装（dnd-kit）
- リアルタイム通知機能
- メール送信機能の統合
- 見積書生成機能
- 分析レポート機能

## ファイル一覧

```
app/vendor/
├── layout.tsx                    # ベンダーレイアウト
├── dashboard/
│   └── page.tsx                  # ダッシュボードホーム
├── profile/
│   └── page.tsx                  # プロフィール管理
├── services/
│   └── page.tsx                  # サービス管理
├── inquiries/
│   ├── page.tsx                  # 問い合わせ一覧
│   └── [id]/
│       └── page.tsx              # 問い合わせ詳細
├── instagram/
│   └── page.tsx                  # Instagram連携
└── billing/
    └── page.tsx                  # 課金管理

components/vendor/
├── StatCard.tsx                  # 統計カード
├── QuickActions.tsx              # クイックアクション
├── RecentInquiries.tsx           # 最近の問い合わせ
└── index.ts                      # エクスポート
```

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run typecheck

# リント
npm run lint

# Prismaスタジオ起動（データベース確認）
npm run db:studio
```

## アクセスURL（開発環境）

- ダッシュボード: http://localhost:3000/vendor/dashboard
- プロフィール管理: http://localhost:3000/vendor/profile
- サービス管理: http://localhost:3000/vendor/services
- 問い合わせ管理: http://localhost:3000/vendor/inquiries
- Instagram連携: http://localhost:3000/vendor/instagram
- 課金管理: http://localhost:3000/vendor/billing

---

**作成日:** 2025-12-02
**Issue:** #11
**実装者:** Claude Code (CodeGenAgent)
