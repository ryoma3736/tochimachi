# Instagram Graph API 連携ドキュメント

## 概要

とちまちプロジェクトにおける **Instagram Basic Display API 連携機能** の技術ドキュメントです。

本機能は「写真で見て選べる栃木県の優良店舗」を実現するコア機能として、業者のInstagramアカウントと連携し、投稿データをリアルタイムで取得・表示します。

---

## 機能一覧

### 1. OAuth 2.0 認証フロー

- Instagram Basic Display API を使用した認証
- CSRF対策（stateパラメータにvendorIdを使用）
- 短期トークン → 長期トークン（60日有効）への自動交換
- トークンの暗号化保存（AES-256-GCM）

### 2. 業者側API

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|---------|------|------|
| `/api/vendor/instagram/connect` | POST | Instagram連携開始（OAuth URL生成） | 必要（vendor） |
| `/api/auth/instagram/callback` | GET | OAuth認証コールバック | 不要 |
| `/api/vendor/instagram/disconnect` | DELETE | Instagram連携解除 | 必要（vendor） |
| `/api/vendor/instagram/status` | GET | 連携ステータス取得 | 必要（vendor） |

### 3. 一般公開API

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|---------|------|------|
| `/api/vendors/[id]/instagram/posts` | GET | Instagram投稿取得 | 不要 |

### 4. データキャッシュ

- Instagram APIレスポンスをDB保存（`syncedPosts` JSONフィールド）
- キャッシュ優先で高速レスポンス
- `sync=true` パラメータでリアルタイム取得可能

---

## アーキテクチャ

### データフロー

```
[業者] → [OAuth開始API] → [Instagram認証画面] → [コールバックAPI]
                                                        ↓
                                                  [トークン交換]
                                                        ↓
                                                  [暗号化保存]
                                                        ↓
                                              [Prisma Database]

[一般ユーザー] → [投稿取得API] → [キャッシュ or Instagram API] → [投稿データ]
```

### セキュリティ対策

#### 1. アクセストークン暗号化

```typescript
// lib/utils/encryption.ts
encrypt(accessToken) // AES-256-GCM
  ↓
DB保存（暗号化済み）
  ↓
decrypt(encryptedToken) // 復号化してAPI呼び出し
```

#### 2. CSRF対策

```typescript
// stateパラメータにvendorIdを埋め込み
const authUrl = getInstagramAuthUrl(vendorId);
// → https://api.instagram.com/oauth/authorize?state=vendor123...
```

#### 3. 環境変数管理

- `ENCRYPTION_KEY`: 32バイトhex（`openssl rand -hex 32`）
- `INSTAGRAM_APP_ID`: Instagram App ID
- `INSTAGRAM_APP_SECRET`: Instagram App Secret
- `INSTAGRAM_REDIRECT_URI`: OAuth Redirect URI

---

## セットアップ手順

### 1. Instagram App作成

1. [Facebook Developers](https://developers.facebook.com/apps/) にアクセス
2. 新しいアプリを作成
3. 「Instagram Basic Display」製品を追加
4. OAuth Redirect URIを設定:
   - 開発: `http://localhost:3000/api/auth/instagram/callback`
   - 本番: `https://tochimachi.jp/api/auth/instagram/callback`
5. App ID と App Secret を取得

### 2. 環境変数設定

`.env` ファイルに以下を追加:

```bash
# Instagram Basic Display API
INSTAGRAM_APP_ID=your_app_id_here
INSTAGRAM_APP_SECRET=your_app_secret_here
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/instagram/callback

# Encryption Key (32 bytes hex)
ENCRYPTION_KEY=$(openssl rand -hex 32)
```

### 3. Prismaマイグレーション実行

```bash
npm run db:generate
npm run db:migrate
```

### 4. 動作確認

```bash
npm run dev
```

ブラウザで `/vendor/settings/instagram` にアクセスし、連携テストを実行。

---

## API 詳細仕様

### POST /api/vendor/instagram/connect

**説明**: Instagram OAuth認証URL生成

**認証**: vendor（業者）のみ

**リクエスト**: なし

**レスポンス**:

```json
{
  "authUrl": "https://api.instagram.com/oauth/authorize?client_id=...",
  "message": "Redirect to Instagram for authorization"
}
```

**エラー**:

- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: 業者アカウントが未承認
- `500 Internal Server Error`: Instagram API設定エラー

---

### GET /api/auth/instagram/callback

**説明**: Instagram OAuth認証コールバック処理

**認証**: 不要

**Query Parameters**:

- `code`: Instagram認証コード（必須）
- `state`: vendorId（必須）
- `error`: エラーコード（認証拒否時）

**処理フロー**:

1. 認証コードを短期アクセストークンに交換
2. 短期トークンを長期トークン（60日有効）に交換
3. トークンを暗号化してDB保存
4. `/vendor/settings/instagram?status=success` にリダイレクト

**リダイレクト**:

- 成功: `/vendor/settings/instagram?status=success&username=...`
- 失敗: `/vendor/settings/instagram?status=error&message=...`

---

### DELETE /api/vendor/instagram/disconnect

**説明**: Instagram連携解除

**認証**: vendor（業者）のみ

**リクエスト**: なし

**レスポンス**:

```json
{
  "message": "Instagram account disconnected successfully"
}
```

**エラー**:

- `401 Unauthorized`: 認証が必要
- `404 Not Found`: Instagram連携が存在しない

---

### GET /api/vendor/instagram/status

**説明**: Instagram連携ステータス取得

**認証**: vendor（業者）のみ

**リクエスト**: なし

**レスポンス**:

```json
{
  "data": {
    "isConnected": true,
    "username": "tochimachi_official",
    "lastSyncAt": "2025-12-02T12:34:56.789Z",
    "postsCount": 42
  }
}
```

---

### GET /api/vendors/[id]/instagram/posts

**説明**: 業者のInstagram投稿取得（一般公開API）

**認証**: 不要

**Query Parameters**:

- `sync`: "true"でリアルタイム取得（デフォルト: キャッシュ優先）
- `limit`: 取得件数（デフォルト: 25、最大: 100）

**リクエスト例**:

```
GET /api/vendors/vendor123/instagram/posts?sync=true&limit=50
```

**レスポンス**:

```json
{
  "data": {
    "isConnected": true,
    "username": "tochimachi_official",
    "posts": [
      {
        "id": "17841408123456789",
        "caption": "栃木県のおすすめスポット！",
        "media_type": "IMAGE",
        "media_url": "https://instagram.com/p/ABC123/media",
        "permalink": "https://instagram.com/p/ABC123/",
        "timestamp": "2025-12-02T12:00:00+0000"
      }
    ],
    "lastSyncAt": "2025-12-02T12:34:56.789Z",
    "source": "instagram_api"
  }
}
```

**source**:

- `cache`: キャッシュデータ（高速）
- `instagram_api`: リアルタイムデータ（`sync=true`時）

---

## データモデル

### InstagramAccount

```prisma
model InstagramAccount {
  id                String    @id @default(uuid())
  vendorId          String    @unique @map("vendor_id")
  instagramUsername String    @map("instagram_username")
  accessToken       String?   @map("access_token") // 暗号化保存
  lastSyncAt        DateTime? @map("last_sync_at")
  syncedPosts       Json?     @map("synced_posts")
  isActive          Boolean   @default(true) @map("is_active")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  @@index([vendorId])
  @@index([lastSyncAt])
  @@map("instagram_accounts")
}
```

### syncedPosts データ構造

```json
[
  {
    "id": "17841408123456789",
    "caption": "投稿キャプション",
    "media_type": "IMAGE",
    "media_url": "https://...",
    "permalink": "https://instagram.com/p/ABC123/",
    "timestamp": "2025-12-02T12:00:00+0000",
    "username": "tochimachi_official"
  }
]
```

---

## エラーハンドリング

### InstagramAPIError クラス

```typescript
class InstagramAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'InstagramAPIError';
  }
}
```

### 一般的なエラー

| エラー | 原因 | 対処法 |
|-------|------|--------|
| `Instagram API not configured` | 環境変数未設定 | `.env`に`INSTAGRAM_APP_ID`等を設定 |
| `ENCRYPTION_KEY not set` | 暗号化キー未設定 | `openssl rand -hex 32`で生成 |
| `Failed to exchange code for token` | 認証コード無効 | 再度OAuth認証を実行 |
| `Failed to fetch Instagram posts` | アクセストークン期限切れ | トークンリフレッシュまたは再認証 |

---

## トークン管理

### 長期トークンの有効期限

- **有効期限**: 60日
- **更新方法**: `refreshInstagramToken()` 関数を使用
- **自動更新**: 有効期限の7日前に自動リフレッシュ（cron job推奨）

### トークンリフレッシュ実装例

```typescript
import { refreshInstagramToken } from '@/lib/instagram';

// Cron job（毎日実行）
async function refreshAllTokens() {
  const accounts = await prisma.instagramAccount.findMany({
    where: { isActive: true },
  });

  for (const account of accounts) {
    try {
      await refreshInstagramToken(account.vendorId);
      console.log(`✅ Refreshed token for ${account.vendorId}`);
    } catch (error) {
      console.error(`❌ Failed to refresh ${account.vendorId}:`, error);
    }
  }
}
```

---

## セキュリティベストプラクティス

### 1. トークン保護

- ✅ AES-256-GCM暗号化
- ✅ データベースに平文保存しない
- ✅ ログに出力しない

### 2. API制限

- ✅ レート制限を尊重（Instagram API: 200 calls/hour）
- ✅ キャッシュ優先でAPI呼び出しを最小化

### 3. エラーレスポンス

- ✅ 機密情報をクライアントに返さない
- ✅ 詳細エラーはサーバーログのみ

---

## パフォーマンス最適化

### 1. キャッシュ戦略

- **デフォルト動作**: DBキャッシュを返却（高速）
- **リアルタイム取得**: `sync=true` パラメータで明示的に指定

### 2. ページネーション対応

- Instagram APIのページネーション（`after`カーソル）に対応
- 一度に最大100件まで取得可能

### 3. 同期頻度

- **推奨**: 1日1回の自動同期（cron job）
- **手動同期**: 業者が `/vendor/settings/instagram` から実行可能

---

## テスト

### ユニットテスト例

```typescript
import { encrypt, decrypt } from '@/lib/utils/encryption';

describe('Encryption', () => {
  it('should encrypt and decrypt correctly', () => {
    const plainText = 'test_access_token';
    const encrypted = encrypt(plainText);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(plainText);
  });
});
```

### 統合テスト

```bash
# Instagram連携フロー全体をテスト
npm run test:integration
```

---

## トラブルシューティング

### Q1: Instagram認証後、コールバックでエラーが発生する

**原因**:
- Redirect URIの設定ミス
- 環境変数の設定漏れ

**対処法**:

1. Facebook Developers で Redirect URI を確認
2. `.env` の `INSTAGRAM_REDIRECT_URI` が一致しているか確認
3. ブラウザのコンソールでエラー詳細を確認

### Q2: 投稿が取得できない

**原因**:
- アクセストークンの期限切れ
- Instagram APIの制限

**対処法**:

1. `/api/vendor/instagram/status` でステータス確認
2. トークンリフレッシュまたは再認証
3. レート制限を確認（200 calls/hour）

### Q3: 暗号化キーエラー

**原因**:
- `ENCRYPTION_KEY` が32バイトhexではない

**対処法**:

```bash
# 新しいキーを生成
openssl rand -hex 32

# .envに設定
ENCRYPTION_KEY=生成された64文字のhex文字列
```

---

## 本番環境デプロイ

### チェックリスト

- [ ] Instagram App の本番環境設定完了
- [ ] Redirect URI を本番URLに変更
- [ ] 環境変数を本番環境に設定
- [ ] HTTPS有効化（Instagram API要件）
- [ ] トークンリフレッシュのcron job設定
- [ ] エラー監視・アラート設定

### 環境変数（本番環境）

```bash
INSTAGRAM_APP_ID=本番App ID
INSTAGRAM_APP_SECRET=本番App Secret
INSTAGRAM_REDIRECT_URI=https://tochimachi.jp/api/auth/instagram/callback
ENCRYPTION_KEY=本番用暗号化キー（32バイトhex）
```

---

## 関連リンク

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook Developers Console](https://developers.facebook.com/apps/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 更新履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-12-02 | 1.0.0 | 初版作成（Issue #16実装完了） |

---

## ライセンス

MIT License

---

## サポート

技術的な質問や問題は、GitHubのIssueで報告してください。

- GitHub Issues: `https://github.com/ryoma3736/tochimachi/issues`
- 担当: CodeGenAgent (源 💻)
