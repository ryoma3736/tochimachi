# データベーススキーマ概要

## クイックリファレンス

### エンティティ一覧

| No  | テーブル名        | 用途             | レコード数想定 |
| --- | ----------------- | ---------------- | -------------- |
| 1   | Users             | 顧客ユーザー     | 10,000+        |
| 2   | Vendors           | 登録業者         | **最大300社**  |
| 3   | VendorProfiles    | 業者プロフィール | 300            |
| 4   | Categories        | 業種カテゴリ     | 10-20          |
| 5   | Services          | サービスメニュー | 3,000+         |
| 6   | Inquiries         | 問い合わせ       | 50,000+        |
| 7   | InquiryItems      | 問い合わせ明細   | 100,000+       |
| 8   | Subscriptions     | 月額課金情報     | 300            |
| 9   | InstagramAccounts | Instagram連携    | 150-300        |
| 10  | Admins            | 管理者           | 5-10           |

---

## リレーションシップ図

### 1対1リレーション

```
Vendors (1) ←→ (1) VendorProfiles
Vendors (1) ←→ (1) Subscriptions
Vendors (1) ←→ (0..1) InstagramAccounts
```

### 1対多リレーション

```
Categories (1) ←→ (*) Vendors
Vendors (1) ←→ (*) Services
Vendors (1) ←→ (*) Inquiries
Users (1) ←→ (*) Inquiries
Inquiries (1) ←→ (*) InquiryItems
```

---

## 主要クエリパターン

### 1. アクティブ業者一覧取得

```typescript
const activeVendors = await prisma.vendor.findMany({
  where: {
    isActive: true,
    approvedAt: { not: null },
  },
  include: {
    profile: true,
    category: true,
  },
  orderBy: {
    displayOrder: 'asc',
  },
});
```

**パフォーマンス**: インデックス `(approvedAt, isActive)` 使用

---

### 2. カテゴリ別業者検索

```typescript
const constructionVendors = await prisma.vendor.findMany({
  where: {
    category: {
      slug: 'construction',
    },
    isActive: true,
    approvedAt: { not: null },
  },
  include: {
    profile: true,
    services: {
      where: { isActive: true },
    },
  },
});
```

**パフォーマンス**: インデックス `categoryId` 使用

---

### 3. 問い合わせ作成（カート機能）

```typescript
// Step 1: 問い合わせ作成（draft状態）
const inquiry = await prisma.inquiry.create({
  data: {
    userId: user.id,
    vendorId: vendor.id,
    status: 'DRAFT',
    message: '',
  },
});

// Step 2: サービスをカートに追加
const item = await prisma.inquiryItem.create({
  data: {
    inquiryId: inquiry.id,
    serviceId: service.id,
    serviceName: service.name, // スナップショット
    servicePrice: service.price, // スナップショット
    quantity: 1,
  },
});

// Step 3: 問い合わせ送信
await prisma.inquiry.update({
  where: { id: inquiry.id },
  data: {
    status: 'SUBMITTED',
    submittedAt: new Date(),
    message: '見積もりをお願いします',
  },
});
```

---

### 4. 業者ダッシュボード - 未返信問い合わせ

```typescript
const pendingInquiries = await prisma.inquiry.findMany({
  where: {
    vendorId: currentVendor.id,
    status: 'SUBMITTED',
  },
  include: {
    user: {
      select: {
        name: true,
        email: true,
        phone: true,
      },
    },
    items: {
      include: {
        service: true,
      },
    },
  },
  orderBy: {
    submittedAt: 'desc',
  },
});
```

**パフォーマンス**: インデックス `(vendorId, status)` 使用

---

### 5. 月額課金処理

```typescript
// 次回課金日が今日以前のサブスクリプションを取得
const dueSubscriptions = await prisma.subscription.findMany({
  where: {
    nextBillingDate: { lte: new Date() },
    status: 'ACTIVE',
  },
  include: {
    vendor: true,
  },
});

// 課金処理後、次回課金日を更新
for (const sub of dueSubscriptions) {
  const nextMonth = new Date(sub.nextBillingDate);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      currentPeriodStart: sub.nextBillingDate,
      currentPeriodEnd: nextMonth,
      nextBillingDate: nextMonth,
      paymentHistory: {
        push: {
          date: new Date(),
          amount: sub.monthlyFee.toNumber(),
          status: 'success',
        },
      },
    },
  });
}
```

---

## データ整合性ルール

### 1. 業者数制限（300社）

アプリケーション層で実装:

```typescript
async function canRegisterNewVendor(): Promise<boolean> {
  const count = await prisma.vendor.count();
  return count < 300;
}
```

### 2. displayOrder の一意性

```typescript
async function getNextDisplayOrder(): Promise<number> {
  const maxOrder = await prisma.vendor.aggregate({
    _max: { displayOrder: true },
  });
  return (maxOrder._max.displayOrder || 0) + 1;
}
```

### 3. カスケード削除

- **Vendor削除** → VendorProfile, Services, Inquiries, Subscription, InstagramAccount も削除
- **Inquiry削除** → InquiryItems も削除
- **Service削除** → InquiryItems.serviceId は NULL に設定（履歴保持）

---

## パフォーマンス最適化

### インデックス効果測定

```sql
-- 実行計画確認（PostgreSQL）
EXPLAIN ANALYZE
SELECT * FROM vendors
WHERE is_active = true AND approved_at IS NOT NULL
ORDER BY display_order ASC;
```

### クエリ最適化チェックリスト

- [ ] `select` で必要なフィールドのみ取得
- [ ] `include` の深さを最小化（N+1問題回避）
- [ ] ページネーション実装（大量データ対応）
- [ ] 頻繁なクエリ結果をキャッシュ
- [ ] 集計クエリは定期バッチで事前計算

---

## セキュリティ対策

### 1. パスワードハッシュ化

```typescript
import bcrypt from 'bcrypt';

// 登録時
const passwordHash = await bcrypt.hash(password, 12);

// ログイン時
const isValid = await bcrypt.compare(password, user.passwordHash);
```

### 2. Instagram トークン暗号化

```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 3. SQLインジェクション対策

Prismaは自動的にパラメータ化するため、基本的に安全です。
生SQLを使う場合は必ずパラメータバインド:

```typescript
// ❌ 危険
await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ 安全
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;
```

---

## バックアップ・復旧

### 日次バックアップスクリプト

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/tochimachi"
DB_NAME="tochimachi"

mkdir -p $BACKUP_DIR

# PostgreSQL バックアップ
pg_dump -U postgres $DB_NAME | gzip > "$BACKUP_DIR/tochimachi_$DATE.sql.gz"

# 古いバックアップ削除（30日以上前）
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: tochimachi_$DATE.sql.gz"
```

### リストア手順

```bash
# バックアップから復元
gunzip -c /backups/tochimachi/tochimachi_20250102_120000.sql.gz | psql -U postgres tochimachi
```

---

## モニタリング

### 重要メトリクス

1. **業者数**: 常に300社以下を確認
2. **アクティブサブスクリプション数**: 課金漏れチェック
3. **未返信問い合わせ数**: カスタマーサポート負荷確認
4. **データベース接続数**: 接続プール枯渇監視

### 監視クエリ例

```typescript
// 定期実行（cron）
async function monitorSystemHealth() {
  const [vendorCount, activeSubscriptions, pendingInquiries] = await Promise.all([
    prisma.vendor.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.inquiry.count({ where: { status: 'SUBMITTED' } }),
  ]);

  console.log({
    vendorCount,
    vendorCapacityRemaining: 300 - vendorCount,
    activeSubscriptions,
    pendingInquiries,
  });

  // アラート送信処理
  if (vendorCount >= 290) {
    sendAlert('業者数が上限に近づいています');
  }
}
```

---

## 参考資料

- [完全ER図](./ER_DIAGRAM.md)
- [Prismaセットアップガイド](../../prisma/README.md)
- [マイグレーション履歴](../../prisma/migrations/)

---

**作成日**: 2025-12-02
**対象バージョン**: Prisma 5.x + PostgreSQL 14.x
