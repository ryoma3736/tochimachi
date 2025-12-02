# Prisma Database Setup

とちまちプロジェクトのデータベースセットアップガイドです。

## 前提条件

- Node.js 18.x 以上
- PostgreSQL 14.x 以上
- npm または yarn

## 初期セットアップ

### 1. Prismaのインストール

```bash
npm install prisma @prisma/client
npm install -D tsx @types/node
```

### 2. 環境変数の設定

`.env`ファイルを作成し、データベース接続情報を設定します。

```bash
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/tochimachi?schema=public"
```

**本番環境の例（SSL接続）**:

```bash
DATABASE_URL="postgresql://user:pass@prod-db.example.com:5432/tochimachi?schema=public&sslmode=require"
```

### 3. データベースの作成

PostgreSQLに接続して、データベースを作成します。

```bash
# PostgreSQLクライアントで実行
createdb tochimachi

# または psql で
psql -U postgres -c "CREATE DATABASE tochimachi;"
```

### 4. マイグレーションの実行

Prismaスキーマからデータベーステーブルを生成します。

```bash
# マイグレーション作成と適用（開発環境）
npx prisma migrate dev --name init

# または本番環境デプロイ時
npx prisma migrate deploy
```

### 5. Prisma Clientの生成

```bash
npx prisma generate
```

### 6. 初期データの投入（Seed）

```bash
npx tsx prisma/seed.ts
```

## データベース管理コマンド

### Prisma Studio（GUIツール）

```bash
npx prisma studio
```

ブラウザで `http://localhost:5555` を開いてデータベースを確認・編集できます。

### マイグレーション

```bash
# 新しいマイグレーション作成
npx prisma migrate dev --name <migration_name>

# 本番環境へのデプロイ
npx prisma migrate deploy

# マイグレーション状態の確認
npx prisma migrate status

# マイグレーションをリセット（警告: 全データ削除）
npx prisma migrate reset
```

### スキーマフォーマット

```bash
npx prisma format
```

### データベース検証

```bash
# スキーマとDBの整合性チェック
npx prisma validate

# データベース同期（マイグレーション不要で直接反映、開発用）
npx prisma db push
```

## スキーマ変更時のワークフロー

1. `schema.prisma` を編集
2. フォーマット: `npx prisma format`
3. マイグレーション作成: `npx prisma migrate dev --name <変更内容>`
4. Prisma Client再生成: `npx prisma generate`（自動実行される）
5. TypeScript型定義の更新確認

## 初期データ（Seed）の更新

`prisma/seed.ts` を編集後:

```bash
# Seedデータを再投入（既存データ削除後）
npx prisma migrate reset

# または手動でSeedのみ実行
npx tsx prisma/seed.ts
```

## トラブルシューティング

### エラー: "Can't reach database server"

**原因**: PostgreSQLが起動していない、または接続情報が間違っている

**解決策**:

```bash
# PostgreSQLの起動確認
pg_ctl status

# macOSの場合
brew services start postgresql@14
```

### エラー: "P3009: migrate found failed migration"

**原因**: 失敗したマイグレーションが残っている

**解決策**:

```bash
# 失敗したマイグレーションを修正
npx prisma migrate resolve --rolled-back <migration_name>

# または強制リセット（開発環境のみ）
npx prisma migrate reset
```

### エラー: "prisma-client-js version mismatch"

**原因**: Prisma CLIとPrisma Clientのバージョン不一致

**解決策**:

```bash
# 依存関係を再インストール
npm install prisma @prisma/client --save-dev
npx prisma generate
```

## 本番環境へのデプロイ

### 1. マイグレーションのみ適用（データ保持）

```bash
# 本番DBに接続
export DATABASE_URL="postgresql://..."

# マイグレーション適用
npx prisma migrate deploy
```

### 2. バックアップ推奨

```bash
# PostgreSQLバックアップ
pg_dump -U username tochimachi > backup_$(date +%Y%m%d).sql

# リストア
psql -U username tochimachi < backup_20250102.sql
```

### 3. 環境変数の設定

本番環境では以下の環境変数を設定してください:

```bash
DATABASE_URL="postgresql://..."
NODE_ENV="production"
```

## パフォーマンスチューニング

### Connection Pooling

```env
# .env - 接続プール設定
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=10&pool_timeout=20"
```

### インデックス確認

```bash
# Prisma Studio でインデックスを視覚的に確認
npx prisma studio

# または SQL で確認
psql -d tochimachi -c "\d+ vendors"
```

## セキュリティ

### 1. パスワードハッシュ化

Seedファイルの仮ハッシュを必ず変更してください:

```typescript
import bcrypt from 'bcrypt';

const passwordHash = await bcrypt.hash('password', 12);
```

### 2. 機密情報の暗号化

Instagram accessToken などは暗号化して保存:

```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // ...
}
```

## package.json の設定

以下のスクリプトを `package.json` に追加することを推奨:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "db:validate": "prisma validate"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## 参考リンク

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

**最終更新**: 2025-12-02
**Prisma Version**: 5.x
**PostgreSQL Version**: 14.x+
