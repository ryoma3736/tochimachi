# データベースセットアップガイド

とちまちプロジェクトのデータベース環境を構築するための完全ガイドです。

## 前提条件

### 必須ソフトウェア

- **Node.js**: 18.x 以上
- **PostgreSQL**: 14.x 以上
- **npm**: 9.x 以上

### インストール確認

```bash
node --version  # v18.x.x 以上
npm --version   # 9.x.x 以上
psql --version  # PostgreSQL 14.x 以上
```

---

## セットアップ手順

### Step 1: 依存関係のインストール

```bash
cd /Users/satoryouma/genie_0.1/tochimachi

# 依存関係をインストール
npm install
```

これにより、以下がインストールされます:

- `@prisma/client`: Prisma ORMクライアント
- `prisma`: Prisma CLI
- その他の開発依存関係

### Step 2: PostgreSQLのセットアップ

#### macOS（Homebrew）

```bash
# PostgreSQL のインストール
brew install postgresql@14

# PostgreSQL の起動
brew services start postgresql@14

# データベース作成
createdb tochimachi
```

#### Linux（Ubuntu/Debian）

```bash
# PostgreSQL のインストール
sudo apt update
sudo apt install postgresql-14

# PostgreSQL の起動
sudo systemctl start postgresql
sudo systemctl enable postgresql

# データベース作成
sudo -u postgres createdb tochimachi
```

#### Docker（推奨）

```bash
# docker-compose.yml 作成
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: tochimachi-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: tochimachi
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# PostgreSQL 起動
docker-compose up -d

# 接続確認
docker exec -it tochimachi-db psql -U postgres -d tochimachi
```

### Step 3: 環境変数の設定

`.env` ファイルを作成します。

```bash
# .env.example からコピー
cp .env.example .env
```

`.env` ファイルを編集:

```bash
# 最低限必要な設定
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tochimachi?schema=public"
ENCRYPTION_KEY="your_32_byte_hex_key_here"
```

#### 暗号化キーの生成

```bash
# ランダムな32バイトキーを生成
openssl rand -hex 32

# 出力例: 3f8b5c7a9d2e1f4b8c6a3d5e7f9b1c4d2e6f8a1b3c5d7e9f1a2b3c4d5e6f7a8b
```

生成されたキーを `.env` の `ENCRYPTION_KEY` に設定してください。

### Step 4: データベーススキーマの適用

```bash
# Prisma マイグレーションの実行
npm run db:migrate

# プロンプトで入力を求められたら、マイグレーション名を入力
# 例: "init" または "initial_schema"
```

実行内容:

1. `prisma/schema.prisma` を読み込み
2. データベーステーブルを作成
3. インデックスを設定
4. リレーションを構築

### Step 5: 初期データの投入

```bash
# Seed データの投入
npm run db:seed
```

投入されるデータ:

- カテゴリ: 6件（建設業、飲食業、小売業など）
- 管理者: 1件（admin@tochimachi.jp）
- サンプル業者: 3社
- サンプルサービス: 6件
- サブスクリプション: 3件
- テストユーザー: 1件

### Step 6: 動作確認

#### Prisma Studio（GUI）で確認

```bash
npm run db:studio
```

ブラウザで `http://localhost:5555` を開き、データが正しく投入されているか確認します。

#### CLIで確認

```bash
# PostgreSQL クライアントで接続
psql -d tochimachi

# テーブル一覧表示
\dt

# サンプルクエリ
SELECT company_name, email FROM vendors;
SELECT name, slug FROM categories;
```

---

## 開発用コマンド

### よく使うコマンド

```bash
# Prisma Client の再生成
npm run db:generate

# マイグレーション作成
npm run db:migrate

# 本番環境へのマイグレーション適用
npm run db:migrate:deploy

# データベースリセット（全データ削除 + マイグレーション再実行 + Seed）
npm run db:reset

# Prisma Studio 起動
npm run db:studio

# スキーマ検証
npm run db:validate

# マイグレーション不要でスキーマ同期（開発用）
npm run db:push
```

### マイグレーション管理

```bash
# スキーマ変更後、新しいマイグレーション作成
npm run db:migrate -- --name add_reviews_table

# マイグレーション状態確認
npx prisma migrate status

# 失敗したマイグレーションをロールバック
npx prisma migrate resolve --rolled-back 20250102000000_migration_name
```

---

## トラブルシューティング

### エラー: "Can't reach database server"

**原因**: PostgreSQL が起動していない、または接続情報が間違っている

**解決策**:

```bash
# PostgreSQL 起動確認（macOS Homebrew）
brew services list

# PostgreSQL 起動（macOS）
brew services start postgresql@14

# Docker の場合
docker ps | grep tochimachi-db
docker-compose up -d

# 接続確認
psql -U postgres -d tochimachi -c "SELECT 1;"
```

### エラー: "P3009: migrate found failed migration"

**原因**: 失敗したマイグレーションが残っている

**解決策**:

```bash
# 失敗したマイグレーションを削除（開発環境のみ）
rm -rf prisma/migrations/20250102000000_failed_migration

# データベースをリセット
npm run db:reset
```

### エラー: "prisma-client-js version mismatch"

**原因**: Prisma CLI と Prisma Client のバージョン不一致

**解決策**:

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# Prisma Client 再生成
npm run db:generate
```

### エラー: "Unique constraint failed on the fields: (`email`)"

**原因**: Seed データが既に存在する

**解決策**:

```bash
# データベースをリセットして再実行
npm run db:reset
```

### パフォーマンスが遅い

**診断**:

```bash
# 実行計画を確認
psql -d tochimachi

EXPLAIN ANALYZE SELECT * FROM vendors WHERE is_active = true;
```

**解決策**:

- インデックスが適切に設定されているか確認
- `prisma/schema.prisma` の `@@index` を確認
- 必要に応じてインデックスを追加

---

## 本番環境へのデプロイ

### 環境変数の設定

本番環境では以下の環境変数を設定:

```bash
DATABASE_URL="postgresql://user:pass@prod-db.example.com:5432/tochimachi?schema=public&sslmode=require"
ENCRYPTION_KEY="本番用の32バイト暗号化キー"
NODE_ENV="production"
```

### マイグレーション適用

```bash
# 本番環境に接続
export DATABASE_URL="postgresql://..."

# マイグレーション適用（データ保持）
npm run db:migrate:deploy

# Prisma Client 再生成
npm run db:generate
```

### バックアップ推奨

デプロイ前に必ずバックアップを取得:

```bash
# PostgreSQL バックアップ
pg_dump -U username -h hostname tochimachi > backup_$(date +%Y%m%d_%H%M%S).sql

# 圧縮
gzip backup_20250102_120000.sql
```

---

## セキュリティチェックリスト

- [ ] `.env` ファイルを `.gitignore` に追加
- [ ] 本番環境用の強力なパスワードを設定
- [ ] ENCRYPTION_KEY を安全に管理（環境変数 or Secrets Manager）
- [ ] PostgreSQL の SSL 接続を有効化（`sslmode=require`）
- [ ] 管理者のデフォルトパスワードを変更
- [ ] データベースユーザーの権限を最小化

---

## 次のステップ

1. **API開発**: Next.js API Routes で Prisma Client を使用
2. **認証実装**: NextAuth.js + Prisma Adapter
3. **テスト作成**: Jest + Prisma Mock
4. **パフォーマンス測定**: Prisma Metrics + OpenTelemetry

参考ドキュメント:

- [完全ER図](./ER_DIAGRAM.md)
- [スキーマ概要](./SCHEMA_OVERVIEW.md)
- [Prisma公式ドキュメント](https://www.prisma.io/docs)

---

**作成日**: 2025-12-02
**対象環境**: Node.js 18+, PostgreSQL 14+, Prisma 5.x
