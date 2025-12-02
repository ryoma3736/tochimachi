# カート・セッション管理API ドキュメント

> Issue #15 実装完了 ✅
> 実装日: 2025-12-02

## 概要

とちまちプラットフォームのカート機能を提供するREST APIです。ゲストユーザーとログインユーザー両方に対応し、セッションベースでカート状態を管理します。

## 特徴

- **セッションベース管理**: Cookie経由でセッションIDを発行・管理
- **ゲスト対応**: ログイン不要でカート利用可能
- **カートマージ**: ログイン時にゲストカートとユーザーカートを自動マージ
- **自動期限管理**: 7日間の有効期限、期限切れカートは自動削除
- **型安全**: TypeScript完全対応
- **リレーション**: Vendor、Service、User各モデルと適切に関連付け

## データモデル

### Cart（カート）

```prisma
model Cart {
  id        String   @id @default(uuid())
  userId    String?  @map("user_id") // nullable for guest users
  sessionId String   @unique @map("session_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  expiresAt DateTime @map("expires_at") // 7日間有効期限

  user  User?       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]
}
```

### CartItem（カートアイテム）

```prisma
model CartItem {
  id        String   @id @default(uuid())
  cartId    String   @map("cart_id")
  vendorId  String   @map("vendor_id")
  serviceId String?  @map("service_id") // optional
  quantity  Int      @default(1)
  notes     String?  @db.Text
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  cart    Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  vendor  Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  service Service? @relation(fields: [serviceId], references: [id], onDelete: SetNull)
}
```

## API エンドポイント

### 1. カート取得

**エンドポイント**: `GET /api/cart`

**説明**: 現在のセッションに紐づくカート情報を取得します。カートが存在しない場合は自動作成されます。

**リクエスト**: なし（Cookie経由でセッションID取得）

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "cart-uuid",
      "userId": null,
      "sessionId": "session-id",
      "createdAt": "2025-12-02T10:00:00.000Z",
      "updatedAt": "2025-12-02T10:00:00.000Z",
      "expiresAt": "2025-12-09T10:00:00.000Z",
      "items": [
        {
          "id": "item-uuid",
          "vendorId": "vendor-uuid",
          "serviceId": "service-uuid",
          "quantity": 1,
          "notes": null,
          "createdAt": "2025-12-02T10:00:00.000Z",
          "updatedAt": "2025-12-02T10:00:00.000Z",
          "vendor": {
            "id": "vendor-uuid",
            "companyName": "栃木建設株式会社",
            "categoryId": "category-uuid"
          },
          "service": {
            "id": "service-uuid",
            "name": "住宅リフォーム",
            "price": 500000,
            "unit": "1件"
          }
        }
      ]
    },
    "totalPrice": 500000,
    "itemCount": 1
  }
}
```

**エラーレスポンス**:

```json
{
  "success": false,
  "error": "Failed to fetch cart",
  "message": "エラー詳細"
}
```

### 2. カートアイテム追加

**エンドポイント**: `POST /api/cart/items`

**説明**: カートに新しいアイテムを追加します。同じ業者・サービスの組み合わせが既に存在する場合は数量が加算されます。

**リクエストボディ**:

```json
{
  "vendorId": "vendor-uuid", // 必須
  "serviceId": "service-uuid", // オプション（業者のみの問い合わせも可能）
  "quantity": 1, // オプション（デフォルト: 1）
  "notes": "見積もりをお願いします" // オプション
}
```

**レスポンス**:

```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "id": "item-uuid",
    "vendorId": "vendor-uuid",
    "serviceId": "service-uuid",
    "quantity": 1,
    "notes": "見積もりをお願いします",
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:00:00.000Z",
    "vendor": {
      "id": "vendor-uuid",
      "companyName": "栃木建設株式会社",
      "categoryId": "category-uuid"
    },
    "service": {
      "id": "service-uuid",
      "name": "住宅リフォーム",
      "price": 500000,
      "unit": "1件"
    }
  }
}
```

**バリデーションエラー**:

```json
{
  "success": false,
  "error": "Vendor ID is required"
}
```

```json
{
  "success": false,
  "error": "Quantity must be at least 1"
}
```

**404エラー**:

```json
{
  "success": false,
  "error": "Vendor not found",
  "message": "Vendor not found: vendor-uuid"
}
```

### 3. カートアイテム更新

**エンドポイント**: `PUT /api/cart/items/:id`

**説明**: カートアイテムの数量やメモを更新します。

**パスパラメータ**:
- `id`: カートアイテムのUUID

**リクエストボディ**:

```json
{
  "quantity": 2, // オプション
  "notes": "急ぎでお願いします" // オプション
}
```

**レスポンス**:

```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "id": "item-uuid",
    "vendorId": "vendor-uuid",
    "serviceId": "service-uuid",
    "quantity": 2,
    "notes": "急ぎでお願いします",
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:05:00.000Z",
    "vendor": { /* ... */ },
    "service": { /* ... */ }
  }
}
```

**404エラー**:

```json
{
  "success": false,
  "error": "Cart item not found"
}
```

### 4. カートアイテム削除

**エンドポイント**: `DELETE /api/cart/items/:id`

**説明**: カートから特定のアイテムを削除します。

**パスパラメータ**:
- `id`: カートアイテムのUUID

**レスポンス**:

```json
{
  "success": true,
  "message": "Cart item deleted successfully"
}
```

**404エラー**:

```json
{
  "success": false,
  "error": "Cart item not found"
}
```

### 5. カートクリア

**エンドポイント**: `DELETE /api/cart`

**説明**: カート内の全アイテムを削除します。

**レスポンス**:

```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

## セッション管理

### セッションID

- **Cookie名**: `tochimachi_session_id`
- **生成方法**: `crypto.randomBytes(32).toString('hex')`
- **有効期限**: 30日間
- **属性**:
  - `httpOnly`: true（XSS対策）
  - `secure`: production環境のみtrue（HTTPS強制）
  - `sameSite`: lax（CSRF対策）
  - `path`: /（全パスで有効）

### カート有効期限

- **期間**: 7日間
- **自動削除**: `cleanupExpiredCarts()`関数でバッチ処理可能
- **期限切れ時の挙動**: 次回アクセス時に自動的に新規カート作成

## ユーティリティ関数

### `lib/cart.ts`

#### `getOrCreateSessionId(): Promise<string>`

セッションIDを取得、存在しない場合は新規生成してCookieに保存。

#### `getOrCreateCart(sessionId: string, userId?: string | null): Promise<CartData>`

セッションIDからカートを取得、存在しない場合は新規作成。期限切れチェックも実施。

#### `addCartItem(cartId, vendorId, serviceId?, quantity?, notes?): Promise<CartItemData>`

カートにアイテムを追加。既存の同一組み合わせがある場合は数量加算。

#### `updateCartItem(itemId: string, updates): Promise<CartItemData>`

カートアイテムの数量・メモを更新。

#### `deleteCartItem(itemId: string): Promise<void>`

カートアイテムを削除。

#### `clearCart(cartId: string): Promise<void>`

カート内の全アイテムを削除。

#### `mergeGuestCartToUser(guestSessionId: string, userId: string): Promise<CartData>`

ゲストカートをログインユーザーにマージ。重複チェック・数量加算処理を含む。

#### `calculateCartTotal(cart: CartData): number`

カートの合計金額を計算。

#### `cleanupExpiredCarts(): Promise<number>`

期限切れカートを削除（バッチ処理用）。削除件数を返す。

## 使用例

### フロントエンド（React/Next.js）

```typescript
// カート取得
const fetchCart = async () => {
  const response = await fetch('/api/cart');
  const data = await response.json();
  return data;
};

// アイテム追加
const addToCart = async (vendorId: string, serviceId?: string) => {
  const response = await fetch('/api/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendorId,
      serviceId,
      quantity: 1,
      notes: '見積もり希望',
    }),
  });
  return response.json();
};

// 数量更新
const updateQuantity = async (itemId: string, quantity: number) => {
  const response = await fetch(`/api/cart/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  return response.json();
};

// アイテム削除
const removeItem = async (itemId: string) => {
  const response = await fetch(`/api/cart/items/${itemId}`, {
    method: 'DELETE',
  });
  return response.json();
};

// カートクリア
const clearCart = async () => {
  const response = await fetch('/api/cart', {
    method: 'DELETE',
  });
  return response.json();
};
```

### ログイン時のカートマージ

```typescript
// 認証後の処理
import { mergeGuestCartToUser } from '@/lib/cart';

async function handleLogin(userId: string) {
  const guestSessionId = cookies().get('tochimachi_session_id')?.value;

  if (guestSessionId) {
    // ゲストカートをユーザーにマージ
    await mergeGuestCartToUser(guestSessionId, userId);
  }
}
```

### バッチ処理（期限切れカートクリーンアップ）

```typescript
// cron job or scheduled task
import { cleanupExpiredCarts } from '@/lib/cart';

async function dailyCleanup() {
  const deletedCount = await cleanupExpiredCarts();
  console.log(`Cleaned up ${deletedCount} expired carts`);
}
```

## データベースマイグレーション

### マイグレーション実行手順

```bash
# .envファイルに DATABASE_URL を設定後

# Prismaクライアント生成
npm run db:generate

# マイグレーション実行
npm run db:migrate

# または、production環境
npm run db:migrate:deploy
```

### マイグレーションファイル

`prisma/migrations/20251202_add_cart_and_cart_items/migration.sql`

- `carts` テーブル作成
- `cart_items` テーブル作成
- インデックス追加（session_id, user_id, expires_at, cart_id, vendor_id, service_id）
- 外部キー制約追加（ON DELETE CASCADE/SET NULL）

## セキュリティ考慮事項

### 実装済み

- ✅ HTTPOnly Cookie（XSS対策）
- ✅ SameSite=Lax（CSRF対策）
- ✅ Secure Cookie（production環境でHTTPS強制）
- ✅ セッションID暗号化（crypto.randomBytes）
- ✅ 外部キー制約（データ整合性）
- ✅ 自動期限切れ削除（ストレージ肥大化防止）

### 今後の実装推奨

- 🔲 Rate Limiting（API呼び出し制限）
- 🔲 CSRF Token（formベース送信の場合）
- 🔲 IPアドレスベース不正検知
- 🔲 カート上限設定（アイテム数・合計金額）

## テスト

### ユニットテスト（TODO）

```typescript
// tests/lib/cart.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCartTotal } from '@/lib/cart';

describe('Cart utilities', () => {
  it('should calculate total price correctly', () => {
    const cart = {
      items: [
        { service: { price: 1000 }, quantity: 2 },
        { service: { price: 500 }, quantity: 1 },
      ],
    };
    expect(calculateCartTotal(cart)).toBe(2500);
  });
});
```

### E2Eテスト（TODO）

```typescript
// tests/e2e/cart.test.ts
import { test, expect } from '@playwright/test';

test('should add item to cart', async ({ page }) => {
  await page.goto('/vendors/vendor-uuid');
  await page.click('button:has-text("カートに追加")');
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toHaveCount(1);
});
```

## パフォーマンス最適化

### 実装済み

- ✅ Prisma select最適化（必要なフィールドのみ取得）
- ✅ インデックス最適化（頻繁に検索されるカラム）
- ✅ リレーション include制御

### 今後の実装推奨

- 🔲 Redis キャッシュ（カート情報）
- 🔲 SWR/React Query（フロントエンドキャッシュ）
- 🔲 データベースコネクションプール最適化

## トラブルシューティング

### 問題: セッションIDが生成されない

**原因**: Cookie設定の問題

**解決策**:
```typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};
```

### 問題: カートマージが動作しない

**原因**: ユーザーID取得失敗

**解決策**:
```typescript
// 認証状態の確認
import { getServerSession } from 'next-auth';

const session = await getServerSession();
const userId = session?.user?.id;
```

### 問題: 期限切れカートが削除されない

**原因**: バッチ処理未実装

**解決策**:
```typescript
// cron job設定（Vercel Cron Jobs）
// vercel.json
{
  "crons": [{
    "path": "/api/cron/cleanup-carts",
    "schedule": "0 0 * * *" // 毎日0時
  }]
}
```

## リファレンス

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Cookie Security Best Practices](https://owasp.org/www-community/controls/SecureCookieAttribute)

---

実装完了: 2025-12-02
担当: CodeGenAgent (源) 💻
