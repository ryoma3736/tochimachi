# 問い合わせ・メール一斉送信API仕様

Issue #14 - とちまち（栃木県ポータルサイト）

## 概要

カートからの一括問い合わせとメール一斉送信機能を提供します。顧客がカートに追加したサービスに対して、業者へ一括で問い合わせを送信し、自動的にメール通知を行います。

## 実装ファイル

### メール送信機能
- `lib/email.ts` - SendGridベースのメール送信ユーティリティ

### 型定義
- `lib/types/inquiry.ts` - 問い合わせ関連の型定義

### API Routes
- `app/api/inquiries/route.ts` - 問い合わせ作成API（POST）
- `app/api/inquiries/[id]/route.ts` - 問い合わせ詳細API（GET, PATCH）
- `app/api/vendor/inquiries/route.ts` - 業者向け問い合わせ一覧API（GET）

## API仕様

### 1. 問い合わせ作成 + メール一斉送信

**エンドポイント**: `POST /api/inquiries`

**説明**:
- 問い合わせを作成し、業者と顧客に自動的にメール通知を送信します
- ログインユーザーとゲストユーザーの両方に対応

**リクエストボディ**:
```json
{
  "vendorId": "業者ID",
  "message": "お問い合わせ内容",
  "userId": "ユーザーID（ログイン時のみ）",
  "guestName": "ゲスト名（ゲストのみ）",
  "guestEmail": "ゲストメール（ゲストのみ）",
  "guestPhone": "ゲスト電話番号（ゲストのみ、任意）",
  "items": [
    {
      "serviceId": "サービスID",
      "serviceName": "サービス名",
      "servicePrice": 10000,
      "quantity": 2,
      "note": "備考（任意）"
    }
  ]
}
```

**レスポンス**: 201 Created
```json
{
  "success": true,
  "inquiry": {
    "id": "問い合わせID",
    "vendorId": "業者ID",
    "status": "SUBMITTED",
    "message": "お問い合わせ内容",
    "submittedAt": "2025-12-02T12:00:00Z",
    "items": [...],
    "vendor": {...},
    "user": {...}
  },
  "message": "Inquiry created and emails sent successfully"
}
```

**メール送信**:
- ✉️ 業者向け: 新規問い合わせ通知
- ✉️ 顧客向け: 問い合わせ受付確認

---

### 2. 問い合わせ詳細取得

**エンドポイント**: `GET /api/inquiries/[id]`

**説明**: 問い合わせの詳細情報を取得します

**レスポンス**: 200 OK
```json
{
  "id": "問い合わせID",
  "vendorId": "業者ID",
  "userId": "ユーザーID（nullable）",
  "status": "SUBMITTED | REPLIED | CLOSED | DRAFT",
  "guestName": "ゲスト名（nullable）",
  "guestEmail": "ゲストメール（nullable）",
  "guestPhone": "ゲスト電話（nullable）",
  "message": "お問い合わせ内容",
  "vendorReply": "業者返信（nullable）",
  "repliedAt": "返信日時（nullable）",
  "submittedAt": "送信日時（nullable）",
  "createdAt": "作成日時",
  "updatedAt": "更新日時",
  "items": [
    {
      "id": "アイテムID",
      "serviceId": "サービスID",
      "serviceName": "サービス名",
      "servicePrice": 10000,
      "quantity": 2,
      "note": "備考",
      "createdAt": "2025-12-02T12:00:00Z"
    }
  ],
  "vendor": {
    "id": "業者ID",
    "companyName": "会社名",
    "email": "業者メール",
    "profile": {
      "contactPhone": "連絡先電話番号"
    }
  },
  "user": {
    "id": "ユーザーID",
    "name": "ユーザー名",
    "email": "ユーザーメール",
    "phone": "電話番号"
  }
}
```

---

### 3. 問い合わせ更新（業者返信）

**エンドポイント**: `PATCH /api/inquiries/[id]`

**説明**:
- 業者が問い合わせに返信します
- 返信すると自動的にステータスが`REPLIED`に更新され、顧客にメール通知が送信されます

**リクエストボディ**:
```json
{
  "vendorReply": "業者からの返信内容",
  "status": "REPLIED | CLOSED（任意）"
}
```

**レスポンス**: 200 OK
```json
{
  "success": true,
  "inquiry": {...},
  "message": "Inquiry updated successfully"
}
```

**メール送信**:
- ✉️ 顧客向け: 業者からの返信通知

---

### 4. 業者向け問い合わせ一覧

**エンドポイント**: `GET /api/vendor/inquiries`

**説明**: 業者が受け取った問い合わせの一覧を取得します

**クエリパラメータ**:
- `vendorId` (必須): 業者ID
- `status` (任意): フィルタ（DRAFT, SUBMITTED, REPLIED, CLOSED）
- `page` (任意): ページ番号（デフォルト: 1）
- `pageSize` (任意): ページサイズ（デフォルト: 20）
- `stats` (任意): 統計情報を含めるか（true/false）

**リクエスト例**:
```
GET /api/vendor/inquiries?vendorId=xxx&status=SUBMITTED&page=1&pageSize=20&stats=true
```

**レスポンス**: 200 OK
```json
{
  "inquiries": [
    {
      "id": "問い合わせID",
      "vendorId": "業者ID",
      "status": "SUBMITTED",
      "customerName": "顧客名",
      "customerEmail": "顧客メール",
      "message": "お問い合わせ内容",
      "submittedAt": "2025-12-02T12:00:00Z",
      "createdAt": "2025-12-02T11:50:00Z",
      "itemsCount": 3
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 20,
  "totalPages": 3,
  "stats": {
    "total": 45,
    "draft": 2,
    "submitted": 15,
    "replied": 20,
    "closed": 8
  }
}
```

---

## メール機能詳細

### メールテンプレート

#### 1. 業者向け: 新規問い合わせ通知

**件名**: 【とちまち】新しいお問い合わせが届きました

**内容**:
- お客様情報（名前、電話番号、メール）
- お問い合わせ内容
- ご希望のサービス一覧
- 問い合わせID

**送信タイミング**: 問い合わせ作成時（`POST /api/inquiries`）

---

#### 2. 顧客向け: 問い合わせ受付確認

**件名**: 【とちまち】お問い合わせを受け付けました

**内容**:
- お問い合わせ先業者名
- お問い合わせ内容
- ご希望のサービス一覧
- 問い合わせID

**送信タイミング**: 問い合わせ作成時（`POST /api/inquiries`）

---

#### 3. 顧客向け: 業者からの返信通知

**件名**: 【とちまち】{業者名} 様からの返信

**内容**:
- 業者からの返信内容
- 元のお問い合わせ内容
- 問い合わせID

**送信タイミング**: 業者が返信時（`PATCH /api/inquiries/[id]`）

---

## メール送信機能 (`lib/email.ts`)

### 主要関数

#### `sendEmail(options: SendEmailOptions): Promise<EmailLog>`
汎用メール送信関数

#### `sendBulkEmails(emails: SendEmailOptions[]): Promise<EmailLog[]>`
複数宛先への一括送信

#### `sendInquiryNotificationToVendor(data: InquiryNotificationData): Promise<EmailLog>`
業者向け問い合わせ通知メール送信

#### `sendInquiryConfirmationToCustomer(data: InquiryConfirmationData): Promise<EmailLog>`
顧客向け問い合わせ受付確認メール送信

#### `sendReplyNotificationToCustomer(data: ReplyNotificationData): Promise<EmailLog>`
顧客向け返信通知メール送信

### 環境変数

`.env`に以下を設定してください：

```env
SENDGRID_API_KEY=SG.your_sendgrid_api_key
```

### メール送信ログ

すべてのメール送信は`EmailLog`として記録されます：

```typescript
interface EmailLog {
  to: string;
  subject: string;
  sentAt: Date;
  success: boolean;
  error?: string;
}
```

---

## データベーススキーマ

### Inquiry（問い合わせ）

```prisma
model Inquiry {
  id          String        @id @default(uuid())
  userId      String?       @map("user_id")
  vendorId    String        @map("vendor_id")
  status      InquiryStatus @default(DRAFT)
  guestName   String?       @map("guest_name")
  guestEmail  String?       @map("guest_email")
  guestPhone  String?       @map("guest_phone")
  message     String        @db.Text
  vendorReply String?       @map("vendor_reply") @db.Text
  repliedAt   DateTime?     @map("replied_at")
  submittedAt DateTime?     @map("submitted_at")
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  user   User?         @relation(fields: [userId], references: [id])
  vendor Vendor        @relation(fields: [vendorId], references: [id])
  items  InquiryItem[]
}
```

### InquiryItem（問い合わせ明細）

```prisma
model InquiryItem {
  id           String   @id @default(uuid())
  inquiryId    String   @map("inquiry_id")
  serviceId    String?  @map("service_id")
  serviceName  String   @map("service_name")
  servicePrice Decimal  @map("service_price") @db.Decimal(10, 2)
  quantity     Int      @default(1)
  note         String?  @db.Text
  createdAt    DateTime @default(now()) @map("created_at")

  inquiry Inquiry  @relation(fields: [inquiryId], references: [id])
  service Service? @relation(fields: [serviceId], references: [id])
  user    User?    @relation(fields: [userId], references: [id])
  userId  String?  @map("user_id")
}
```

### InquiryStatus（問い合わせステータス）

```prisma
enum InquiryStatus {
  DRAFT     // カート状態（未送信）
  SUBMITTED // 送信済み（業者未返信）
  REPLIED   // 業者返信済み
  CLOSED    // 完了・クローズ
}
```

---

## エラーハンドリング

### バリデーションエラー（400）

```json
{
  "error": "vendorId and message are required"
}
```

### リソースが見つからない（404）

```json
{
  "error": "Vendor not found"
}
```

### サーバーエラー（500）

```json
{
  "error": "Internal server error",
  "details": "エラー詳細"
}
```

### メール送信失敗

- 問い合わせは作成されますが、メール送信失敗はログに記録されます
- レスポンスには成功として返却されます（問い合わせ作成が主要処理のため）

---

## 使用例

### フロントエンド実装例

```typescript
// 問い合わせ作成
const createInquiry = async () => {
  const response = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendorId: 'vendor-id',
      message: 'お見積もりをお願いします',
      guestName: '山田太郎',
      guestEmail: 'yamada@example.com',
      guestPhone: '090-1234-5678',
      items: [
        {
          serviceId: 'service-1',
          serviceName: 'ハウスクリーニング',
          servicePrice: 15000,
          quantity: 1,
        },
      ],
    }),
  });

  const data = await response.json();
  console.log('問い合わせID:', data.inquiry.id);
};

// 業者向け問い合わせ一覧取得
const fetchInquiries = async (vendorId: string) => {
  const response = await fetch(
    `/api/vendor/inquiries?vendorId=${vendorId}&status=SUBMITTED&stats=true`
  );
  const data = await response.json();
  console.log('未返信:', data.stats.submitted);
};

// 業者が返信
const replyToInquiry = async (inquiryId: string) => {
  const response = await fetch(`/api/inquiries/${inquiryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendorReply: 'お見積もりをお送りします。',
    }),
  });

  const data = await response.json();
  console.log('返信完了:', data.inquiry.status); // REPLIED
};
```

---

## テスト

### 手動テスト手順

1. **問い合わせ作成テスト**
   ```bash
   curl -X POST http://localhost:3000/api/inquiries \
     -H "Content-Type: application/json" \
     -d '{
       "vendorId": "vendor-id",
       "message": "テスト問い合わせ",
       "guestName": "テストユーザー",
       "guestEmail": "test@example.com",
       "items": [...]
     }'
   ```

2. **問い合わせ一覧取得テスト**
   ```bash
   curl http://localhost:3000/api/vendor/inquiries?vendorId=vendor-id&stats=true
   ```

3. **業者返信テスト**
   ```bash
   curl -X PATCH http://localhost:3000/api/inquiries/inquiry-id \
     -H "Content-Type: application/json" \
     -d '{"vendorReply": "返信テスト"}'
   ```

---

## セキュリティ考慮事項

- [ ] 認証・認可の実装（NextAuth.js統合推奨）
- [ ] レート制限の実装（問い合わせスパム対策）
- [ ] CSRF対策（Next.js自動対応）
- [ ] XSS対策（入力値のサニタイズ）
- [ ] SQLインジェクション対策（Prisma自動対応）
- [ ] メールアドレス検証（バリデーション強化）

---

## 今後の拡張案

- [ ] 問い合わせステータス変更履歴
- [ ] 業者側の自動返信機能
- [ ] リマインダーメール（未返信の場合）
- [ ] 問い合わせ評価機能
- [ ] 添付ファイル対応
- [ ] チャット風UI対応
- [ ] メール送信キュー（Redis + Bull）
- [ ] Webhookサポート

---

## ライセンス

MIT License

---

**作成日**: 2025-12-02
**Issue**: #14
**プロジェクト**: とちまち（栃木県ポータルサイト）
