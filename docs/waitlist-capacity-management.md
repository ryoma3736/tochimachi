# ウェイトリスト・枠管理機能

## 概要

300社限定枠の管理とウェイトリスト機能の実装ドキュメント。

## 機能説明

### 1. 枠管理

- **最大登録業者数**: 300社
- **現在の登録数**: リアルタイムカウント
- **空き枠数**: 自動計算
- **業種別枠配分**: オプション（将来拡張可能）

### 2. ウェイトリスト

#### ステータス遷移

```
WAITING (待機中)
  ↓
NOTIFIED (空き通知済み)
  ↓
PROMOTED (繰り上げ登録済み) or EXPIRED (期限切れ)
```

#### 登録フロー

1. **ウェイトリスト登録**
   - 枠満員時に登録可能
   - メールアドレス・会社名・業種を入力
   - 順番が自動採番される

2. **空き通知**
   - 管理者が手動で通知送信
   - 登録期限: 通知後7日間

3. **繰り上げ登録**
   - 期限内に業者登録を完了
   - ウェイトリストステータスが PROMOTED に変更

4. **期限切れ処理**
   - 自動的に EXPIRED ステータスに変更
   - 次の順位の方に繰り上げ

## データモデル

### Waitlist

| フィールド | 型 | 説明 |
|-----------|-----|-----|
| id | String | UUID |
| email | String | メールアドレス（一意） |
| companyName | String | 会社名 |
| categoryId | String | 業種ID（外部キー） |
| message | String? | 申込理由・メッセージ |
| position | Int | 待機順番 |
| status | WaitlistStatus | ステータス |
| notifiedAt | DateTime? | 空き通知送信日時 |
| expiresAt | DateTime? | 登録期限 |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

### CapacityLog

監査ログ用テーブル。

| フィールド | 型 | 説明 |
|-----------|-----|-----|
| id | String | UUID |
| action | String | アクション種別 |
| vendorCount | Int | アクション時の業者数 |
| waitlistCount | Int | アクション時のウェイトリスト数 |
| categoryId | String? | 業種ID |
| relatedId | String? | 関連ID（VendorまたはWaitlist） |
| performedBy | String? | 実行者（Admin ID） |
| metadata | Json? | 追加情報 |
| createdAt | DateTime | 作成日時 |

## API仕様

### 1. 枠状況取得

```
GET /api/admin/capacity
```

**レスポンス**:
```json
{
  "totalCapacity": 300,
  "currentVendorCount": 285,
  "availableSlots": 15,
  "waitlistCount": 42,
  "isFull": false,
  "categoryBreakdown": [
    {
      "categoryId": "uuid",
      "categoryName": "建設・リフォーム",
      "vendorCount": 80,
      "waitlistCount": 12
    }
  ]
}
```

### 2. ウェイトリスト登録

```
POST /api/waitlist
```

**リクエスト**:
```json
{
  "email": "info@example.com",
  "companyName": "株式会社とちまち",
  "categoryId": "uuid",
  "message": "申込理由など（任意）"
}
```

**レスポンス**:
```json
{
  "success": true,
  "waitlist": {
    "id": "uuid",
    "position": 43,
    "categoryName": "建設・リフォーム"
  }
}
```

### 3. ウェイトリスト一覧取得（管理者）

```
GET /api/admin/waitlist?status=WAITING&categoryId=uuid
```

**レスポンス**:
```json
{
  "waitlists": [...],
  "count": 42
}
```

### 4. ウェイトリスト繰り上げ（管理者）

```
POST /api/admin/waitlist/{id}/promote
```

**処理内容**:
1. ステータスを NOTIFIED に変更
2. expiresAt を7日後に設定
3. 空き通知メールを送信

**レスポンス**:
```json
{
  "success": true,
  "waitlist": {
    "id": "uuid",
    "status": "NOTIFIED",
    "expiresAt": "2025-12-09T12:00:00Z"
  }
}
```

## ユーティリティ関数

### lib/capacity.ts

| 関数 | 説明 |
|------|------|
| `getCapacityStatus()` | 現在の枠状況を取得 |
| `getCategoryCapacityBreakdown()` | 業種別枠状況を取得 |
| `hasAvailableSlot()` | 枠が空いているかチェック |
| `canRegisterWaitlist(email)` | ウェイトリスト登録可能かチェック |
| `addToWaitlist(data)` | ウェイトリスト登録 |
| `getNextWaitlistEntries(limit)` | 次の順番のエントリ取得 |
| `notifyWaitlistEntry(id)` | 空き通知ステータスに更新 |
| `expireNotifiedWaitlists()` | 期限切れ処理 |
| `promoteWaitlistEntry(id)` | 繰り上げ登録（PROMOTED） |
| `cancelWaitlistEntry(id)` | キャンセル |
| `getAllWaitlists(filters)` | ウェイトリスト一覧取得 |
| `getWaitlistEntry(id)` | ウェイトリストエントリ取得 |

## メール通知

### 1. ウェイトリスト登録完了メール

**送信タイミング**: ウェイトリスト登録時

**テンプレート**: `lib/email/templates/waitlist-notification.ts`

**内容**:
- 登録情報（会社名、業種、順位）
- 今後の流れ
- 注意事項

### 2. 空き通知メール

**送信タイミング**: 管理者が繰り上げ実行時

**テンプレート**: `lib/email/templates/waitlist-notification.ts`

**内容**:
- 空き枠発生のお知らせ
- 登録期限（7日間）
- 業者登録URLリンク
- 料金情報

## ページ構成

### 1. ウェイトリスト登録ページ

**パス**: `/waitlist`

**機能**:
- 枠状況の表示
- 登録フォーム（会社名、メール、業種、メッセージ）
- バリデーション
- 登録完了後、完了ページへ遷移

### 2. 登録完了ページ

**パス**: `/waitlist/registered`

**機能**:
- 登録完了メッセージ
- 現在の順位表示
- 今後の流れ説明
- 注意事項

## 自動処理

### Cron Job（推奨）

```bash
# 毎日午前2時に期限切れ処理を実行
0 2 * * * curl -X POST https://tochimachi.jp/api/cron/expire-waitlists
```

**実装例**:
```typescript
// app/api/cron/expire-waitlists/route.ts
import { expireNotifiedWaitlists } from '@/lib/capacity';

export async function POST() {
  const expiredCount = await expireNotifiedWaitlists();
  return Response.json({ expiredCount });
}
```

## セキュリティ

### 管理者API認証

```typescript
// TODO: 実装例
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // ... API処理
}
```

### レート制限

- ウェイトリスト登録API: IP単位で1時間に3回まで
- 管理者API: 認証済みユーザーのみアクセス可能

## テスト

### ユニットテスト例

```typescript
import { describe, it, expect } from '@jest/globals';
import { getCapacityStatus, addToWaitlist } from '@/lib/capacity';

describe('Capacity Management', () => {
  it('should get current capacity status', async () => {
    const status = await getCapacityStatus();
    expect(status.totalCapacity).toBe(300);
    expect(status.currentVendorCount).toBeGreaterThanOrEqual(0);
  });

  it('should add to waitlist', async () => {
    const entry = await addToWaitlist({
      email: 'test@example.com',
      companyName: 'Test Company',
      categoryId: 'uuid',
    });
    expect(entry.position).toBeGreaterThan(0);
    expect(entry.status).toBe('WAITING');
  });
});
```

## マイグレーション

```bash
# Prismaスキーマ変更後、マイグレーション生成
npx prisma migrate dev --name add_waitlist_and_capacity_log

# 本番環境デプロイ
npx prisma migrate deploy
```

## モニタリング

### 監視項目

- ウェイトリスト登録数
- 期限切れエントリ数
- 平均待機期間
- 繰り上げ成功率

### ダッシュボード（推奨）

- 現在の枠状況グラフ
- 業種別分布円グラフ
- ウェイトリスト推移折れ線グラフ
- 最近のアクションログ

## FAQ

### Q1: ウェイトリストの順位は固定ですか？

A1: 基本的に登録順ですが、キャンセルや期限切れにより前後する場合があります。

### Q2: 通知メールが届かない場合は？

A2: 迷惑メールフォルダを確認し、それでも届かない場合はサポートに連絡してください。

### Q3: 業種を変更したい場合は？

A3: ウェイトリストをキャンセルして再登録していただく必要があります。

### Q4: 繰り上げ通知後、7日以内に登録できない場合は？

A4: 自動的に期限切れとなり、次の順位の方に繰り上げされます。再度ウェイトリスト登録が可能です。

## 今後の拡張案

- [ ] 業種別枠配分（カテゴリごとに上限設定）
- [ ] 優先度設定（プレミアム登録など）
- [ ] 自動繰り上げ通知（枠が空いたら自動送信）
- [ ] ウェイトリスト順位変更機能（管理者）
- [ ] キャンセル待ち自動登録（Vendor解約時）
- [ ] ダッシュボード統計グラフ
- [ ] メール通知のリマインダー（期限3日前など）
