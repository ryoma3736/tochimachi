# ウェイトリスト機能セットアップガイド

## セットアップ手順

### 1. Prismaマイグレーション

```bash
# マイグレーション生成
npx prisma migrate dev --name add_waitlist_and_capacity_log

# Prisma Clientを再生成
npx prisma generate
```

### 2. 環境変数設定

`.env` ファイルに以下を追加:

```bash
# アプリケーションURL（メール内のリンク生成用）
NEXT_PUBLIC_APP_URL=https://tochimachi.jp

# SendGrid設定（既存の設定を確認）
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@tochimachi.jp

# 管理者メールアドレス
ADMIN_EMAIL=admin@tochimachi.jp
```

### 3. 初期データ投入（オプション）

カテゴリが未作成の場合、以下のシードデータを投入:

```bash
npx prisma db seed
```

**prisma/seed.ts** (作成が必要な場合):
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // カテゴリ作成
  const categories = [
    { name: '建設・リフォーム', slug: 'construction', displayOrder: 1 },
    { name: '飲食店', slug: 'restaurant', displayOrder: 2 },
    { name: '美容・エステ', slug: 'beauty', displayOrder: 3 },
    { name: '医療・介護', slug: 'medical', displayOrder: 4 },
    { name: 'その他', slug: 'other', displayOrder: 99 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 4. 動作確認

#### 4-1. 枠状況確認

```bash
curl http://localhost:3000/api/admin/capacity
```

**期待レスポンス**:
```json
{
  "totalCapacity": 300,
  "currentVendorCount": 0,
  "availableSlots": 300,
  "waitlistCount": 0,
  "isFull": false,
  "categoryBreakdown": [...]
}
```

#### 4-2. ウェイトリスト登録テスト

```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "companyName": "テスト株式会社",
    "categoryId": "カテゴリUUID",
    "message": "テスト登録"
  }'
```

#### 4-3. ページ動作確認

```
http://localhost:3000/waitlist
```

### 5. Cron設定（本番環境）

期限切れ処理の自動実行を設定:

**Vercel Cron Jobs** (推奨):

`vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/expire-waitlists",
    "schedule": "0 2 * * *"
  }]
}
```

**または、外部Cronサービス**:
```bash
0 2 * * * curl -X POST https://tochimachi.jp/api/cron/expire-waitlists
```

### 6. 管理画面統合（オプション）

管理者ダッシュボードにウェイトリスト管理機能を追加:

```typescript
// app/admin/waitlist/page.tsx
import { getAllWaitlists } from '@/lib/capacity';

export default async function AdminWaitlistPage() {
  const waitlists = await getAllWaitlists({ status: 'WAITING' });

  return (
    <div>
      <h1>ウェイトリスト管理</h1>
      <table>
        {/* ウェイトリスト一覧表示 */}
      </table>
    </div>
  );
}
```

## トラブルシューティング

### マイグレーションエラー

**エラー**: `Foreign key constraint failed`

**原因**: Categoryテーブルにデータが存在しない

**解決**: シードデータを投入してから再実行

### メール送信失敗

**エラー**: `SENDGRID_API_KEY is not configured`

**原因**: 環境変数が未設定

**解決**: `.env` ファイルを確認し、SendGrid APIキーを設定

### ウェイトリスト登録失敗

**エラー**: `Email already registered`

**原因**: 既に同じメールアドレスがVendorまたはWaitlistに登録済み

**解決**: 別のメールアドレスを使用するか、既存データを削除

## データベース直接操作（開発環境）

### ウェイトリスト確認

```sql
SELECT * FROM waitlists ORDER BY position ASC;
```

### 枠管理ログ確認

```sql
SELECT * FROM capacity_logs ORDER BY created_at DESC LIMIT 10;
```

### ウェイトリスト削除（テスト用）

```sql
DELETE FROM waitlists WHERE email = 'test@example.com';
```

## 本番デプロイチェックリスト

- [ ] Prismaマイグレーションが完了している
- [ ] 環境変数が正しく設定されている（NEXT_PUBLIC_APP_URL、SENDGRID_API_KEY）
- [ ] カテゴリデータが投入されている
- [ ] メール送信テストが成功している
- [ ] Cron設定が完了している
- [ ] 管理者認証が実装されている（API保護）
- [ ] レート制限が設定されている
- [ ] モニタリング・ログ設定が完了している

## 参考資料

- [Prisma公式ドキュメント](https://www.prisma.io/docs)
- [SendGrid Node.js SDK](https://github.com/sendgrid/sendgrid-nodejs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
