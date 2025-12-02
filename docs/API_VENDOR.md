# Vendor API Documentation

## 概要

業者管理のためのRESTful APIドキュメント。

**Base URL**: `/api/vendors`

**認証**: 未実装（将来的にはJWT認証を追加予定）

---

## エンドポイント一覧

### 業者API

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/vendors` | 業者一覧取得 |
| POST | `/api/vendors` | 業者新規登録（300社制限） |
| GET | `/api/vendors/:id` | 業者詳細取得 |
| PUT | `/api/vendors/:id` | 業者情報更新 |
| DELETE | `/api/vendors/:id` | 業者削除（論理削除） |

### サービスAPI

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/vendors/:id/services` | サービス一覧取得 |
| POST | `/api/vendors/:id/services` | サービス追加 |
| PUT | `/api/vendors/:id/services/:serviceId` | サービス更新 |
| DELETE | `/api/vendors/:id/services/:serviceId` | サービス削除（論理削除） |

---

## 詳細仕様

## 1. 業者一覧取得

**GET** `/api/vendors`

### Query Parameters

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|---|------|----------|------|
| page | number | No | 1 | ページ番号 |
| limit | number | No | 20 | 1ページあたりの件数（最大100） |
| categoryId | string (UUID) | No | - | カテゴリIDでフィルタ |
| isActive | boolean | No | - | アクティブ状態でフィルタ |
| search | string | No | - | 会社名で検索（部分一致） |

### Response 200 OK

```json
{
  "data": [
    {
      "id": "uuid",
      "email": "vendor@example.com",
      "companyName": "株式会社サンプル",
      "categoryId": "uuid",
      "isActive": true,
      "approvedAt": "2025-12-01T00:00:00.000Z",
      "createdAt": "2025-12-01T00:00:00.000Z",
      "updatedAt": "2025-12-01T00:00:00.000Z",
      "displayOrder": 1,
      "category": {
        "id": "uuid",
        "name": "建設業",
        "slug": "construction"
      },
      "profile": {
        "logoUrl": "https://example.com/logo.png",
        "description": "会社説明",
        "address": "栃木県宇都宮市...",
        "contactPhone": "028-123-4567"
      },
      "_count": {
        "services": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Responses

- **400 Bad Request**: バリデーションエラー
- **500 Internal Server Error**: サーバーエラー

---

## 2. 業者新規登録

**POST** `/api/vendors`

### Request Body

```json
{
  "email": "vendor@example.com",
  "password": "SecurePass123",
  "companyName": "株式会社サンプル",
  "categoryId": "uuid"
}
```

### Validation Rules

| フィールド | ルール |
|-----------|-------|
| email | メールアドレス形式、必須 |
| password | 8文字以上、大小文字・数字を含む、必須 |
| companyName | 1〜100文字、必須 |
| categoryId | UUID形式、必須 |

### Response 201 Created

```json
{
  "data": {
    "id": "uuid",
    "email": "vendor@example.com",
    "companyName": "株式会社サンプル",
    "categoryId": "uuid",
    "isActive": false,
    "displayOrder": 1,
    "createdAt": "2025-12-01T00:00:00.000Z",
    "updatedAt": "2025-12-01T00:00:00.000Z",
    "category": {
      "id": "uuid",
      "name": "建設業",
      "slug": "construction"
    }
  },
  "message": "Vendor created successfully"
}
```

### Error Responses

- **400 Bad Request**: バリデーションエラー
- **403 Forbidden**: 300社上限到達
- **404 Not Found**: カテゴリが存在しない
- **409 Conflict**: メールアドレスが既に使用されている
- **500 Internal Server Error**: サーバーエラー

### 制約事項

- **300社制限**: アクティブな業者が300社に達している場合、新規登録不可
- **displayOrder自動割り当て**: 1〜300の範囲で未使用の最小値を自動割り当て
- **初期状態**: `isActive: false`（管理者承認待ち）

---

## 3. 業者詳細取得

**GET** `/api/vendors/:id`

### Path Parameters

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | string (UUID) | 業者ID |

### Response 200 OK

```json
{
  "data": {
    "id": "uuid",
    "email": "vendor@example.com",
    "companyName": "株式会社サンプル",
    "categoryId": "uuid",
    "isActive": true,
    "approvedAt": "2025-12-01T00:00:00.000Z",
    "createdAt": "2025-12-01T00:00:00.000Z",
    "updatedAt": "2025-12-01T00:00:00.000Z",
    "displayOrder": 1,
    "category": {
      "id": "uuid",
      "name": "建設業",
      "slug": "construction",
      "description": "建設業カテゴリ",
      "iconUrl": "https://example.com/icon.png"
    },
    "profile": {
      "id": "uuid",
      "description": "詳細な会社説明",
      "logoUrl": "https://example.com/logo.png",
      "coverImageUrl": "https://example.com/cover.jpg",
      "businessHours": {
        "mon": "9:00-18:00",
        "tue": "9:00-18:00",
        "wed": "9:00-18:00",
        "thu": "9:00-18:00",
        "fri": "9:00-18:00",
        "sat": "休業",
        "sun": "休業"
      },
      "address": "栃木県宇都宮市...",
      "mapUrl": "https://maps.google.com/...",
      "websiteUrl": "https://example.com",
      "contactPhone": "028-123-4567",
      "gallery": ["url1", "url2"],
      "createdAt": "2025-12-01T00:00:00.000Z",
      "updatedAt": "2025-12-01T00:00:00.000Z"
    },
    "services": [
      {
        "id": "uuid",
        "name": "サービス名",
        "description": "サービス説明",
        "price": 10000,
        "unit": "1時間",
        "duration": 60,
        "isActive": true,
        "createdAt": "2025-12-01T00:00:00.000Z",
        "updatedAt": "2025-12-01T00:00:00.000Z"
      }
    ],
    "subscription": {
      "id": "uuid",
      "plan": "STANDARD",
      "monthlyFee": 120000,
      "status": "ACTIVE",
      "currentPeriodStart": "2025-12-01T00:00:00.000Z",
      "currentPeriodEnd": "2026-01-01T00:00:00.000Z",
      "nextBillingDate": "2026-01-01T00:00:00.000Z"
    },
    "_count": {
      "services": 5,
      "inquiries": 10
    }
  }
}
```

### Error Responses

- **404 Not Found**: 業者が存在しない
- **500 Internal Server Error**: サーバーエラー

---

## 4. 業者情報更新

**PUT** `/api/vendors/:id`

### Path Parameters

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | string (UUID) | 業者ID |

### Request Body

```json
{
  "email": "newemail@example.com",
  "companyName": "新しい会社名",
  "categoryId": "new-uuid",
  "isActive": true
}
```

**Note**: すべてのフィールドはオプション（変更したいものだけを送信）

### Response 200 OK

```json
{
  "data": {
    "id": "uuid",
    "email": "newemail@example.com",
    "companyName": "新しい会社名",
    "categoryId": "new-uuid",
    "isActive": true,
    "approvedAt": "2025-12-01T00:00:00.000Z",
    "createdAt": "2025-12-01T00:00:00.000Z",
    "updatedAt": "2025-12-02T00:00:00.000Z",
    "displayOrder": 1,
    "category": {
      "id": "new-uuid",
      "name": "新カテゴリ",
      "slug": "new-category"
    }
  },
  "message": "Vendor updated successfully"
}
```

### Error Responses

- **400 Bad Request**: バリデーションエラー
- **404 Not Found**: 業者またはカテゴリが存在しない
- **409 Conflict**: メールアドレスが既に使用されている
- **500 Internal Server Error**: サーバーエラー

---

## 5. 業者削除（論理削除）

**DELETE** `/api/vendors/:id`

### Path Parameters

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | string (UUID) | 業者ID |

### Response 200 OK

```json
{
  "data": {
    "id": "uuid",
    "email": "vendor@example.com",
    "companyName": "株式会社サンプル",
    "isActive": false,
    "updatedAt": "2025-12-02T00:00:00.000Z"
  },
  "message": "Vendor deactivated successfully"
}
```

### 実装方針

- **論理削除**: `isActive`を`false`に設定
- **データ保持**: データは完全に削除せず保持
- **300社制限**: 非アクティブな業者は制限カウントに含まれない

### Error Responses

- **404 Not Found**: 業者が存在しない
- **500 Internal Server Error**: サーバーエラー

---

## 6. サービス一覧取得

**GET** `/api/vendors/:id/services`

### Path Parameters

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | string (UUID) | 業者ID |

### Query Parameters

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| isActive | boolean | No | アクティブ状態でフィルタ |

### Response 200 OK

```json
{
  "data": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "name": "サービス名",
      "description": "詳細説明",
      "price": 10000,
      "unit": "1時間",
      "duration": 60,
      "isActive": true,
      "createdAt": "2025-12-01T00:00:00.000Z",
      "updatedAt": "2025-12-01T00:00:00.000Z"
    }
  ],
  "vendor": {
    "id": "uuid",
    "companyName": "株式会社サンプル"
  }
}
```

### Error Responses

- **404 Not Found**: 業者が存在しない
- **500 Internal Server Error**: サーバーエラー

---

## 7. サービス追加

**POST** `/api/vendors/:id/services`

### Path Parameters

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | string (UUID) | 業者ID |

### Request Body

```json
{
  "name": "新サービス",
  "description": "サービス説明",
  "price": 15000,
  "unit": "1回",
  "duration": 90,
  "isActive": true
}
```

### Validation Rules

| フィールド | ルール |
|-----------|-------|
| name | 1〜100文字、必須 |
| description | 最大1000文字、オプション |
| price | 正の数値、最大99,999,999.99、必須 |
| unit | 1〜50文字、必須 |
| duration | 正の整数（分単位）、オプション |
| isActive | boolean、デフォルト: true |

### Response 201 Created

```json
{
  "data": {
    "id": "uuid",
    "vendorId": "uuid",
    "name": "新サービス",
    "description": "サービス説明",
    "price": 15000,
    "unit": "1回",
    "duration": 90,
    "isActive": true,
    "createdAt": "2025-12-02T00:00:00.000Z",
    "updatedAt": "2025-12-02T00:00:00.000Z"
  },
  "message": "Service created successfully"
}
```

### Error Responses

- **400 Bad Request**: バリデーションエラー
- **404 Not Found**: 業者が存在しない
- **500 Internal Server Error**: サーバーエラー

---

## 8. サービス更新

**PUT** `/api/vendors/:id/services/:serviceId`

### Path Parameters

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | string (UUID) | 業者ID |
| serviceId | string (UUID) | サービスID |

### Request Body

```json
{
  "name": "更新サービス名",
  "price": 20000,
  "isActive": false
}
```

**Note**: すべてのフィールドはオプション

### Response 200 OK

```json
{
  "data": {
    "id": "uuid",
    "vendorId": "uuid",
    "name": "更新サービス名",
    "description": "サービス説明",
    "price": 20000,
    "unit": "1回",
    "duration": 90,
    "isActive": false,
    "createdAt": "2025-12-01T00:00:00.000Z",
    "updatedAt": "2025-12-02T00:00:00.000Z"
  },
  "message": "Service updated successfully"
}
```

### Error Responses

- **400 Bad Request**: バリデーションエラー
- **403 Forbidden**: サービスが該当業者に紐付いていない
- **404 Not Found**: 業者またはサービスが存在しない
- **500 Internal Server Error**: サーバーエラー

---

## 9. サービス削除（論理削除）

**DELETE** `/api/vendors/:id/services/:serviceId`

### Path Parameters

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | string (UUID) | 業者ID |
| serviceId | string (UUID) | サービスID |

### Response 200 OK

```json
{
  "data": {
    "id": "uuid",
    "vendorId": "uuid",
    "name": "サービス名",
    "isActive": false,
    "updatedAt": "2025-12-02T00:00:00.000Z"
  },
  "message": "Service deactivated successfully"
}
```

### 実装方針

- **論理削除**: `isActive`を`false`に設定
- **データ保持**: 既存の問い合わせ明細との整合性を保持

### Error Responses

- **403 Forbidden**: サービスが該当業者に紐付いていない
- **404 Not Found**: 業者またはサービスが存在しない
- **500 Internal Server Error**: サーバーエラー

---

## 技術仕様

### 使用技術

- **Framework**: Next.js 16 App Router
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **Password Hashing**: bcryptjs

### ファイル構成

```
app/api/vendors/
├── route.ts                           # GET, POST (業者一覧・作成)
├── [id]/
│   ├── route.ts                       # GET, PUT, DELETE (業者詳細・更新・削除)
│   └── services/
│       ├── route.ts                   # GET, POST (サービス一覧・作成)
│       └── [serviceId]/
│           └── route.ts               # PUT, DELETE (サービス更新・削除)
lib/
├── prisma.ts                          # Prismaクライアント + 300社制限ヘルパー
└── validations/
    └── vendor.ts                      # Zodバリデーションスキーマ
```

### セキュリティ考慮事項

1. **パスワードハッシュ化**: bcryptjs（rounds: 12）
2. **入力バリデーション**: Zodによる厳格なバリデーション
3. **論理削除**: データ完全削除を避け、監査証跡を保持
4. **SQL Injection対策**: Prismaによる自動エスケープ

### 今後の改善予定

- [ ] JWT認証の実装
- [ ] Rate Limiting（レートリミット）
- [ ] API Keyによる業者認証
- [ ] ページネーション最適化（Cursor-based）
- [ ] 全文検索の改善（PostgreSQL Full Text Search）
- [ ] キャッシュ戦略（Redis）

---

## 使用例

### cURLサンプル

#### 業者一覧取得

```bash
curl -X GET "http://localhost:3000/api/vendors?page=1&limit=20&categoryId=uuid&isActive=true"
```

#### 業者新規登録

```bash
curl -X POST "http://localhost:3000/api/vendors" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@example.com",
    "password": "SecurePass123",
    "companyName": "株式会社サンプル",
    "categoryId": "uuid"
  }'
```

#### サービス追加

```bash
curl -X POST "http://localhost:3000/api/vendors/{id}/services" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新サービス",
    "price": 15000,
    "unit": "1回",
    "duration": 90
  }'
```

---

**作成日**: 2025-12-02
**バージョン**: 1.0.0
**担当**: CodeGenAgent (源)
