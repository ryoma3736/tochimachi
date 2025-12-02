# とちまち API リファレンス

> Version: 1.0.0
> Base URL: `https://api.tochimachi.jp/v1`

## 📋 目次

1. [概要](#概要)
2. [認証](#認証)
3. [レート制限](#レート制限)
4. [エラーハンドリング](#エラーハンドリング)
5. [エンドポイント](#エンドポイント)
   - [顧客向けAPI](#顧客向けapi)
   - [業者向けAPI](#業者向けapi)
   - [管理者API](#管理者api)
6. [データモデル](#データモデル)
7. [使用例](#使用例)
8. [レスポンスコード](#レスポンスコード)

---

## 概要

とちまちAPIは、栃木県の地域ポータルサイトのバックエンドサービスを提供するRESTful APIです。

### 主要機能

- **業者検索**: カテゴリ、エリア、価格帯での絞り込み検索
- **問い合わせ管理**: 複数業者への一括問い合わせ送信
- **カート機能**: 問い合わせ対象業者の一時保存
- **Instagram連携**: 業者のInstagram投稿自動表示
- **業者管理**: 業者登録、プロフィール管理、サービス管理
- **管理機能**: 業者承認、課金管理、分析データ

### API設計原則

- **RESTful**: HTTP動詞とリソース指向設計
- **JSON**: すべてのリクエスト・レスポンスはJSON形式
- **バージョニング**: URLパスにバージョン番号を含む（`/v1`）
- **ページネーション**: 大量データは自動的にページ分割
- **エラー一貫性**: 統一されたエラーレスポンス形式

---

## 認証

### 認証方式

| API種別     | 認証方法                 | 必要な権限     |
| ----------- | ------------------------ | -------------- |
| 顧客向けAPI | 不要（一部はセッション） | なし           |
| 業者向けAPI | Bearer Token (JWT)       | 業者アカウント |
| 管理者API   | Bearer Token (JWT)       | 管理者権限     |

### Bearer Token認証

業者向けAPI・管理者APIでは、HTTPヘッダーにBearer Tokenを含める必要があります。

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### トークン取得方法

**業者ログイン**:

```http
POST /api/v1/auth/vendor/login
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "securepassword"
}
```

**レスポンス**:

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpc2lzYXJlZnJlc2h0b2tlbmV4YW1wbGU...",
    "expiresIn": 3600,
    "vendorId": "vendor_001"
  }
}
```

### トークンの有効期限

- **Access Token**: 1時間
- **Refresh Token**: 7日間

---

## レート制限

API使用には以下のレート制限が適用されます。

| ユーザー種別 | 制限                |
| ------------ | ------------------- |
| 認証なし     | 100 requests/hour   |
| 認証済み業者 | 1,000 requests/hour |
| 管理者       | 制限なし            |

### レート制限ヘッダー

レスポンスには以下のヘッダーが含まれます。

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1672531200
```

### レート制限超過時

429 Too Many Requestsが返されます。

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

---

## エラーハンドリング

### エラーレスポンス形式

すべてのエラーは以下の統一形式で返されます。

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### 主なエラーコード

| コード                  | HTTPステータス | 説明                   |
| ----------------------- | -------------- | ---------------------- |
| `VALIDATION_ERROR`      | 400            | リクエストの検証失敗   |
| `UNAUTHORIZED`          | 401            | 認証が必要             |
| `FORBIDDEN`             | 403            | 権限不足               |
| `NOT_FOUND`             | 404            | リソースが見つからない |
| `CONFLICT`              | 409            | リソースの重複         |
| `RATE_LIMIT_EXCEEDED`   | 429            | レート制限超過         |
| `INTERNAL_SERVER_ERROR` | 500            | サーバーエラー         |

---

## エンドポイント

### 顧客向けAPI

#### 1. カテゴリ一覧取得

```http
GET /api/v1/categories
```

**レスポンス例**:

```json
{
  "data": [
    {
      "id": "cat_001",
      "name": "ヘアサロン",
      "slug": "hair-salon",
      "icon": "✂️",
      "description": "美容院、理容室などのヘアサロン",
      "vendorCount": 45,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

#### 2. 業者検索・一覧取得

```http
GET /api/v1/vendors?category=hair-salon&area=宇都宮市&page=1&limit=20
```

**クエリパラメータ**:

| パラメータ   | 型      | 説明           | 例                             |
| ------------ | ------- | -------------- | ------------------------------ |
| `category`   | string  | カテゴリSlug   | `hair-salon`                   |
| `area`       | string  | エリア         | `宇都宮市`                     |
| `priceRange` | string  | 価格帯         | `5000-10000`                   |
| `search`     | string  | キーワード検索 | `カット`                       |
| `sortBy`     | string  | ソート基準     | `rating`, `createdAt`, `price` |
| `page`       | integer | ページ番号     | `1`                            |
| `limit`      | integer | 件数/ページ    | `20` (最大100)                 |

**レスポンス例**:

```json
{
  "data": [
    {
      "id": "vendor_001",
      "name": "美容室サンプル",
      "category": {
        "id": "cat_001",
        "name": "ヘアサロン",
        "slug": "hair-salon"
      },
      "area": "宇都宮市",
      "rating": 4.5,
      "reviewCount": 128,
      "thumbnailUrl": "https://cdn.tochimachi.jp/vendors/001/thumb.jpg",
      "priceRange": "¥¥",
      "isInstagramConnected": true,
      "tags": ["駐車場あり", "キッズルーム"]
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

#### 3. 業者詳細取得

```http
GET /api/v1/vendors/{vendorId}
```

**レスポンス例**:

```json
{
  "data": {
    "id": "vendor_001",
    "name": "美容室サンプル",
    "description": "宇都宮で20年の実績。カット・カラー・パーマなど幅広く対応。",
    "category": {
      "id": "cat_001",
      "name": "ヘアサロン"
    },
    "area": "宇都宮市",
    "address": "栃木県宇都宮市〇〇町1-2-3",
    "phone": "028-123-4567",
    "email": "info@sample-salon.com",
    "website": "https://sample-salon.com",
    "rating": 4.5,
    "reviewCount": 128,
    "openingHours": {
      "monday": "9:00-18:00",
      "tuesday": "9:00-18:00",
      "wednesday": "定休日",
      "thursday": "9:00-18:00",
      "friday": "9:00-20:00",
      "saturday": "9:00-20:00",
      "sunday": "9:00-18:00"
    },
    "images": [
      {
        "url": "https://cdn.tochimachi.jp/vendors/001/img1.jpg",
        "caption": "店内の様子"
      }
    ],
    "services": [
      {
        "id": "svc_001",
        "name": "カット＆カラー",
        "description": "カットとカラーのセットメニュー",
        "price": 8000,
        "duration": 90
      }
    ]
  }
}
```

---

#### 4. サービス一覧取得

```http
GET /api/v1/vendors/{vendorId}/services
```

**レスポンス例**:

```json
{
  "data": [
    {
      "id": "svc_001",
      "name": "カット＆カラー",
      "description": "カットとカラーのセットメニュー",
      "price": 8000,
      "duration": 90,
      "imageUrl": "https://cdn.tochimachi.jp/services/001.jpg",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

#### 5. Instagram投稿取得

```http
GET /api/v1/vendors/{vendorId}/instagram?limit=12
```

**レスポンス例**:

```json
{
  "data": [
    {
      "id": "17895695668004550",
      "mediaType": "IMAGE",
      "mediaUrl": "https://scontent.cdninstagram.com/...",
      "caption": "新しいヘアスタイル✨",
      "permalink": "https://www.instagram.com/p/...",
      "timestamp": "2025-11-20T12:00:00Z",
      "likeCount": 234,
      "commentCount": 12
    }
  ],
  "meta": {
    "username": "sample_salon",
    "followersCount": 1500,
    "isConnected": true
  }
}
```

---

#### 6. 一括問い合わせ送信

```http
POST /api/v1/inquiries
Content-Type: application/json

{
  "vendorIds": ["vendor_001", "vendor_002"],
  "name": "山田太郎",
  "email": "yamada@example.com",
  "phone": "090-1234-5678",
  "message": "見積もりをお願いします。希望日は12月15日です。",
  "preferredDate": "2025-12-15"
}
```

**レスポンス例**:

```json
{
  "data": {
    "inquiryId": "inq_001",
    "vendorIds": ["vendor_001", "vendor_002"],
    "status": "sent",
    "createdAt": "2025-12-02T10:30:00Z"
  }
}
```

---

#### 7. カート取得

```http
GET /api/v1/cart
```

**レスポンス例**:

```json
{
  "data": {
    "items": [
      {
        "id": "cart_item_001",
        "vendor": {
          "id": "vendor_001",
          "name": "美容室サンプル",
          "thumbnailUrl": "https://cdn.tochimachi.jp/vendors/001/thumb.jpg"
        },
        "service": {
          "id": "svc_001",
          "name": "カット＆カラー",
          "price": 8000
        },
        "addedAt": "2025-12-02T10:00:00Z"
      }
    ],
    "totalItems": 3,
    "createdAt": "2025-12-02T09:00:00Z"
  }
}
```

---

#### 8. カートに追加

```http
POST /api/v1/cart/items
Content-Type: application/json

{
  "vendorId": "vendor_001",
  "serviceId": "svc_001"
}
```

**レスポンス**: 更新されたカート情報（201 Created）

---

#### 9. カートから削除

```http
DELETE /api/v1/cart/items/{cartItemId}
```

**レスポンス**: 204 No Content

---

### 業者向けAPI

#### 1. 業者登録

```http
POST /api/v1/auth/vendor/register
Content-Type: application/json

{
  "name": "美容室サンプル",
  "email": "info@sample-salon.com",
  "password": "SecurePassword123!",
  "categoryId": "cat_001",
  "area": "宇都宮市",
  "phone": "028-123-4567",
  "address": "栃木県宇都宮市〇〇町1-2-3",
  "description": "宇都宮で20年の実績"
}
```

**レスポンス例**:

```json
{
  "data": {
    "vendorId": "vendor_123",
    "status": "pending",
    "message": "Registration successful. Your account is pending approval."
  }
}
```

---

#### 2. 業者ログイン

```http
POST /api/v1/auth/vendor/login
Content-Type: application/json

{
  "email": "info@sample-salon.com",
  "password": "SecurePassword123!"
}
```

**レスポンス**: [トークン取得方法](#トークン取得方法)を参照

---

#### 3. プロフィール取得

```http
GET /api/v1/vendor/profile
Authorization: Bearer {accessToken}
```

**レスポンス例**:

```json
{
  "data": {
    "id": "vendor_001",
    "name": "美容室サンプル",
    "email": "info@sample-salon.com",
    "category": {
      "id": "cat_001",
      "name": "ヘアサロン"
    },
    "area": "宇都宮市",
    "status": "approved",
    "subscriptionPlan": "basic",
    "isInstagramConnected": false,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-11-20T10:00:00Z"
  }
}
```

---

#### 4. プロフィール更新

```http
PUT /api/v1/vendor/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "description": "宇都宮で20年の実績。お客様に寄り添った施術を心がけています。",
  "phone": "028-123-4567",
  "website": "https://sample-salon.com",
  "openingHours": {
    "monday": "9:00-18:00",
    "tuesday": "9:00-18:00",
    "wednesday": "定休日"
  }
}
```

**レスポンス**: 更新されたプロフィール情報

---

#### 5. サービス管理一覧

```http
GET /api/v1/vendor/services
Authorization: Bearer {accessToken}
```

**レスポンス**: サービス一覧（自社のみ）

---

#### 6. サービス追加

```http
POST /api/v1/vendor/services
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "カット＆カラー",
  "description": "カットとカラーのセットメニュー",
  "price": 8000,
  "duration": 90,
  "imageUrl": "https://cdn.tochimachi.jp/services/001.jpg"
}
```

**レスポンス**: 作成されたサービス情報（201 Created）

---

#### 7. 問い合わせ一覧

```http
GET /api/v1/vendor/inquiries?status=unread&page=1&limit=20
Authorization: Bearer {accessToken}
```

**レスポンス例**:

```json
{
  "data": [
    {
      "id": "inq_001",
      "customerName": "山田太郎",
      "customerEmail": "yamada@example.com",
      "customerPhone": "090-1234-5678",
      "message": "見積もりをお願いします",
      "status": "unread",
      "preferredDate": "2025-12-15",
      "createdAt": "2025-12-02T10:30:00Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

#### 8. Instagram連携

```http
POST /api/v1/vendor/instagram/connect
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "accessToken": "IGQVJXa1FzTVRBN2xQdFFHZAU...",
  "username": "sample_salon"
}
```

**レスポンス例**:

```json
{
  "data": {
    "isConnected": true,
    "username": "sample_salon",
    "profilePictureUrl": "https://scontent.cdninstagram.com/..."
  }
}
```

---

### 管理者API

#### 1. 業者管理一覧

```http
GET /api/v1/admin/vendors?status=pending&page=1&limit=50
Authorization: Bearer {adminToken}
```

**レスポンス**: 業者一覧（管理者用拡張情報付き）

---

#### 2. 業者承認

```http
PUT /api/v1/admin/vendors/{vendorId}/approve
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "status": "approved"
}
```

**却下の場合**:

```json
{
  "status": "rejected",
  "reason": "提出書類に不備があります"
}
```

**レスポンス例**:

```json
{
  "data": {
    "vendorId": "vendor_123",
    "status": "approved",
    "updatedAt": "2025-12-02T11:00:00Z"
  }
}
```

---

#### 3. 課金管理一覧

```http
GET /api/v1/admin/subscriptions?status=active&page=1
Authorization: Bearer {adminToken}
```

**レスポンス例**:

```json
{
  "data": [
    {
      "id": "sub_001",
      "vendorId": "vendor_001",
      "plan": "premium",
      "status": "active",
      "startDate": "2025-01-01",
      "endDate": "2026-01-01",
      "amount": 9800,
      "nextBillingDate": "2025-02-01"
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
}
```

---

#### 4. 分析データ取得

```http
GET /api/v1/admin/analytics?startDate=2025-11-01&endDate=2025-11-30&metric=inquiries
Authorization: Bearer {adminToken}
```

**レスポンス例**:

```json
{
  "data": {
    "period": {
      "startDate": "2025-11-01",
      "endDate": "2025-11-30"
    },
    "metrics": {
      "totalPageviews": 12500,
      "totalInquiries": 450,
      "totalRevenue": 350000,
      "activeVendors": 85,
      "newVendors": 12
    },
    "chartData": [
      {
        "date": "2025-11-01",
        "value": 15
      },
      {
        "date": "2025-11-02",
        "value": 18
      }
    ]
  }
}
```

---

#### 5. ウェイトリスト取得

```http
GET /api/v1/admin/waitlist?page=1&limit=100
Authorization: Bearer {adminToken}
```

**レスポンス例**:

```json
{
  "data": [
    {
      "id": "wl_001",
      "email": "newbiz@example.com",
      "name": "新規ビジネス",
      "businessType": "飲食店",
      "area": "宇都宮市",
      "status": "pending",
      "createdAt": "2025-11-25T14:30:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 100,
    "totalPages": 1
  }
}
```

---

## データモデル

### Category（カテゴリ）

| フィールド    | 型       | 説明               |
| ------------- | -------- | ------------------ |
| `id`          | string   | カテゴリID         |
| `name`        | string   | カテゴリ名         |
| `slug`        | string   | URLスラッグ        |
| `icon`        | string   | アイコン（絵文字） |
| `description` | string   | 説明文             |
| `vendorCount` | integer  | 業者数             |
| `createdAt`   | datetime | 作成日時           |

---

### Vendor（業者）

| フィールド             | 型            | 説明               |
| ---------------------- | ------------- | ------------------ |
| `id`                   | string        | 業者ID             |
| `name`                 | string        | 業者名             |
| `category`             | Category      | カテゴリ           |
| `area`                 | string        | エリア             |
| `rating`               | float         | 評価（0-5）        |
| `reviewCount`          | integer       | レビュー数         |
| `thumbnailUrl`         | string        | サムネイル画像URL  |
| `priceRange`           | string        | 価格帯（¥/¥¥/¥¥¥） |
| `isInstagramConnected` | boolean       | Instagram連携状態  |
| `tags`                 | array[string] | タグ               |

---

### Service（サービス）

| フィールド    | 型       | 説明           |
| ------------- | -------- | -------------- |
| `id`          | string   | サービスID     |
| `name`        | string   | サービス名     |
| `description` | string   | 説明           |
| `price`       | integer  | 価格（円）     |
| `duration`    | integer  | 所要時間（分） |
| `imageUrl`    | string   | 画像URL        |
| `createdAt`   | datetime | 作成日時       |

---

### Inquiry（問い合わせ）

| フィールド      | 型            | 説明                              |
| --------------- | ------------- | --------------------------------- |
| `id`            | string        | 問い合わせID                      |
| `vendorIds`     | array[string] | 送信先業者IDリスト                |
| `name`          | string        | 問い合わせ者名                    |
| `email`         | string        | メールアドレス                    |
| `phone`         | string        | 電話番号                          |
| `message`       | string        | メッセージ本文                    |
| `preferredDate` | date          | 希望日（オプション）              |
| `status`        | string        | ステータス（unread/read/replied） |
| `createdAt`     | datetime      | 作成日時                          |

---

## 使用例

### JavaScript (Fetch API)

```javascript
// 業者検索
async function searchVendors() {
  const response = await fetch(
    'https://api.tochimachi.jp/v1/vendors?category=hair-salon&area=宇都宮市',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  console.log(data.data);
}

// 問い合わせ送信
async function sendInquiry() {
  const response = await fetch('https://api.tochimachi.jp/v1/inquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vendorIds: ['vendor_001', 'vendor_002'],
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-1234-5678',
      message: '見積もりをお願いします',
    }),
  });

  const data = await response.json();
  console.log(data);
}

// 業者向け: プロフィール更新
async function updateProfile(accessToken) {
  const response = await fetch('https://api.tochimachi.jp/v1/vendor/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      description: '新しい説明文',
      phone: '028-123-4567',
    }),
  });

  const data = await response.json();
  console.log(data);
}
```

---

### cURL

```bash
# カテゴリ一覧取得
curl -X GET "https://api.tochimachi.jp/v1/categories" \
  -H "Content-Type: application/json"

# 業者検索
curl -X GET "https://api.tochimachi.jp/v1/vendors?category=hair-salon&area=宇都宮市&page=1&limit=20" \
  -H "Content-Type: application/json"

# 問い合わせ送信
curl -X POST "https://api.tochimachi.jp/v1/inquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorIds": ["vendor_001"],
    "name": "山田太郎",
    "email": "yamada@example.com",
    "message": "見積もりをお願いします"
  }'

# 業者ログイン
curl -X POST "https://api.tochimachi.jp/v1/auth/vendor/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@example.com",
    "password": "password123"
  }'

# プロフィール取得（認証必要）
curl -X GET "https://api.tochimachi.jp/v1/vendor/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Python (requests)

```python
import requests

BASE_URL = "https://api.tochimachi.jp/v1"

# 業者検索
def search_vendors():
    response = requests.get(
        f"{BASE_URL}/vendors",
        params={
            "category": "hair-salon",
            "area": "宇都宮市",
            "page": 1,
            "limit": 20
        }
    )
    return response.json()

# 問い合わせ送信
def send_inquiry():
    data = {
        "vendorIds": ["vendor_001"],
        "name": "山田太郎",
        "email": "yamada@example.com",
        "phone": "090-1234-5678",
        "message": "見積もりをお願いします"
    }
    response = requests.post(f"{BASE_URL}/inquiries", json=data)
    return response.json()

# 業者向け: プロフィール更新
def update_vendor_profile(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    data = {
        "description": "新しい説明文",
        "phone": "028-123-4567"
    }
    response = requests.put(
        f"{BASE_URL}/vendor/profile",
        headers=headers,
        json=data
    )
    return response.json()

# 使用例
vendors = search_vendors()
print(vendors)
```

---

## レスポンスコード

| コード  | 意味                  | 説明                                 |
| ------- | --------------------- | ------------------------------------ |
| **200** | OK                    | リクエスト成功                       |
| **201** | Created               | リソース作成成功                     |
| **204** | No Content            | 成功（レスポンスボディなし）         |
| **400** | Bad Request           | 不正なリクエスト（検証エラーなど）   |
| **401** | Unauthorized          | 認証が必要                           |
| **403** | Forbidden             | 権限不足                             |
| **404** | Not Found             | リソースが見つからない               |
| **409** | Conflict              | リソースの重複（メールアドレスなど） |
| **429** | Too Many Requests     | レート制限超過                       |
| **500** | Internal Server Error | サーバーエラー                       |
| **503** | Service Unavailable   | サービス一時停止                     |

---

## サポート

### 技術サポート

- **Email**: api@tochimachi.jp
- **ドキュメント**: https://docs.tochimachi.jp/api
- **GitHub Issues**: https://github.com/tochimachi/api/issues

### リソース

- [OpenAPI仕様書](./openapi.yaml)
- [開発者ポータル](https://developers.tochimachi.jp)
- [Changelog](./CHANGELOG.md)

---

**Last Updated**: 2025-12-02
**Version**: 1.0.0
**License**: MIT
