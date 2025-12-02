# SendGridメール配信システム セットアップガイド

> **とちまち（栃木県ポータルサイト）** - Email Delivery System

このガイドでは、SendGridを使用したメール配信システムのセットアップ方法と運用手順を説明します。

---

## 📋 目次

- [1. SendGridアカウントのセットアップ](#1-sendgridアカウントのセットアップ)
- [2. ドメイン認証（SPF/DKIM）](#2-ドメイン認証spfdkim)
- [3. 環境変数の設定](#3-環境変数の設定)
- [4. メールテンプレート一覧](#4-メールテンプレート一覧)
- [5. 使用方法](#5-使用方法)
- [6. 送信キューの使用](#6-送信キューの使用)
- [7. トラブルシューティング](#7-トラブルシューティング)
- [8. 本番環境での推奨事項](#8-本番環境での推奨事項)

---

## 1. SendGridアカウントのセットアップ

### 1.1 SendGridアカウント作成

1. [SendGrid公式サイト](https://sendgrid.com/)でアカウントを作成
2. 無料プランで開始可能（100通/日まで）
3. メールアドレスを確認

### 1.2 API Keyの取得

1. SendGridダッシュボードにログイン
2. **Settings** > **API Keys** に移動
3. **Create API Key** をクリック
4. 以下の設定を行う:
   - **API Key Name**: `tochimachi-production`（環境に応じて命名）
   - **API Key Permissions**: `Full Access` または `Mail Send` のみ

5. 生成されたAPI Keyをコピー（後で再表示できないため注意）

```bash
# 例: API Key
SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

---

## 2. ドメイン認証（SPF/DKIM）

ドメイン認証を行うことで、メールの到達率が大幅に向上します。

### 2.1 ドメイン認証手順

1. SendGridダッシュボードで **Settings** > **Sender Authentication** に移動
2. **Domain Authentication** セクションで **Authenticate Your Domain** をクリック
3. DNS設定情報が表示されます

### 2.2 DNS設定（例）

以下のDNSレコードをドメインプロバイダー（お名前.com、ムームードメインなど）で設定:

#### SPFレコード（TXTレコード）

```
Type: TXT
Host: @
Value: v=spf1 include:sendgrid.net ~all
```

#### DKIMレコード（CNAMEレコード）

```
Type: CNAME
Host: s1._domainkey
Value: s1.domainkey.u12345678.wl.sendgrid.net

Type: CNAME
Host: s2._domainkey
Value: s2.domainkey.u12345678.wl.sendgrid.net
```

> **注**: 値はSendGridが提供するものを使用してください。

### 2.3 認証確認

- DNS設定後、24-48時間で反映
- SendGridダッシュボードで認証ステータスを確認
- 緑のチェックマークが表示されれば成功

---

## 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下を設定:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyy

# 送信元メールアドレス（認証済みドメイン）
SENDGRID_FROM_EMAIL=noreply@tochimachi.jp

# 管理者メールアドレス（システムアラート送信先）
ADMIN_EMAIL=admin@tochimachi.jp
```

### 環境別設定

#### 開発環境（`.env.local`）

```bash
SENDGRID_API_KEY=SG.test_xxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=dev@tochimachi.jp
ADMIN_EMAIL=dev-admin@tochimachi.jp
```

#### 本番環境（`.env.production`）

```bash
SENDGRID_API_KEY=SG.prod_xxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@tochimachi.jp
ADMIN_EMAIL=admin@tochimachi.jp
```

---

## 4. メールテンプレート一覧

プロジェクトには以下のメールテンプレートが用意されています。

### 4.1 業者向けメール

| テンプレート | ファイル | 用途 |
|-------------|---------|------|
| **問い合わせ通知** | `lib/email.ts` | 顧客からの問い合わせ通知 |
| **月額課金通知** | `lib/email/templates/billing-monthly-charge.ts` | 月額料金の請求通知 |
| **課金失敗警告** | `lib/email/templates/billing-payment-failure.ts` | 決済失敗時の警告 |
| **審査承認通知** | `lib/email/templates/billing-approval.ts` | 業者登録の審査承認 |

### 4.2 顧客向けメール

| テンプレート | ファイル | 用途 |
|-------------|---------|------|
| **問い合わせ確認** | `lib/email.ts` | 問い合わせ受付確認 |
| **パスワードリセット** | `lib/email/templates/auth-password-reset.ts` | パスワード再設定 |
| **アカウント確認** | `lib/email/templates/auth-account-verification.ts` | 登録メールアドレス確認 |

### 4.3 システムメール

| テンプレート | ファイル | 用途 |
|-------------|---------|------|
| **管理者アラート** | `lib/email/templates/admin-alert.ts` | システムエラー・警告通知 |

---

## 5. 使用方法

### 5.1 基本的なメール送信

```typescript
import { sendEmail } from '@/lib/email/send';

// 汎用メール送信
const log = await sendEmail({
  to: 'customer@example.com',
  subject: 'テストメール',
  text: 'これはテストメールです。',
  html: '<p>これは<strong>テストメール</strong>です。</p>',
});

console.log('送信成功:', log.success);
```

### 5.2 型安全なテンプレートメール送信

#### 月額課金通知を送信

```typescript
import { sendMonthlyChargeEmail } from '@/lib/email/send';

const log = await sendMonthlyChargeEmail({
  vendorName: '栃木花屋',
  vendorEmail: 'vendor@example.com',
  billingPeriod: '2025年12月',
  amount: 5000,
  dueDate: '2025年12月31日',
  planName: 'スタンダードプラン',
  invoiceId: 'INV-2025-12-001',
  paymentMethod: 'クレジットカード (****1234)',
});
```

#### パスワードリセットメールを送信

```typescript
import { sendPasswordResetEmail } from '@/lib/email/send';

const log = await sendPasswordResetEmail({
  userName: '山田太郎',
  userEmail: 'user@example.com',
  resetToken: 'abc123xyz',
  resetUrl: 'https://tochimachi.jp/auth/reset-password?token=abc123xyz',
  expiresAt: '2025年12月3日 15:30',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
});
```

#### 管理者アラートを送信

```typescript
import { sendAdminAlertEmail } from '@/lib/email/send';

const log = await sendAdminAlertEmail({
  alertType: 'error',
  alertTitle: '決済システムエラー',
  alertMessage: 'Stripe API接続に失敗しました。',
  timestamp: new Date().toISOString(),
  source: 'Payment System',
  details: {
    errorCode: 'STRIPE_CONNECTION_FAILED',
    endpoint: '/api/payments',
  },
  actionRequired: 'Stripe APIキーの有効性を確認してください。',
  affectedUsers: 3,
});
```

### 5.3 複数宛先への一括送信

```typescript
import { sendBulkEmails } from '@/lib/email/send';

const logs = await sendBulkEmails([
  {
    to: 'vendor1@example.com',
    subject: 'お知らせ1',
    text: 'メッセージ1',
  },
  {
    to: 'vendor2@example.com',
    subject: 'お知らせ2',
    text: 'メッセージ2',
  },
]);

console.log(`${logs.filter((l) => l.success).length}/${logs.length} 件送信成功`);
```

---

## 6. 送信キューの使用

大量のメール送信時には、キューを使用して非同期処理を行います。

### 6.1 基本的なキュー使用

```typescript
import { sendEmailQueued, emailQueue } from '@/lib/email/send';

// メールをキューに追加
const emailId = sendEmailQueued({
  to: 'customer@example.com',
  subject: 'キュー経由メール',
  text: 'このメールはキュー経由で送信されます。',
});

console.log('Email ID:', emailId);

// キューの状態を確認
const status = emailQueue.getStatus();
console.log('キュー状態:', status);
// => { pending: 1, processing: 0, completed: 0, failed: 0 }
```

### 6.2 本番環境: Redis + Bull推奨

```typescript
// ⚠️ 本番環境では Redis + Bull を使用することを強く推奨

// package.jsonに追加
// "bull": "^4.11.0",
// "redis": "^4.6.0"

// 例: Bull キュー実装
import Queue from 'bull';

const emailQueue = new Queue('email', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

emailQueue.process(async (job) => {
  const { to, subject, text, html } = job.data;
  await sendEmail({ to, subject, text, html });
});

// メール送信
emailQueue.add({ to, subject, text, html });
```

---

## 7. トラブルシューティング

### 7.1 メールが送信されない

**症状**: `sendEmail()` が失敗する

**確認項目**:

1. **API Keyが正しいか確認**
   ```bash
   echo $SENDGRID_API_KEY
   ```

2. **SendGridダッシュボードでAPI Key権限を確認**
   - `Mail Send` 権限が必要

3. **送信元メールアドレスが認証済みか確認**
   - `SENDGRID_FROM_EMAIL` がドメイン認証済みドメインと一致しているか

4. **ログを確認**
   ```bash
   # エラーログを確認
   [Email] Failed to send: Forbidden
   ```

### 7.2 メールが迷惑メールに振り分けられる

**原因**:
- SPF/DKIM認証が未設定
- 送信元ドメインの評判が低い

**対処法**:

1. **ドメイン認証を完了させる**（[2. ドメイン認証](#2-ドメイン認証spfdkim)参照）

2. **SPFレコードを確認**
   ```bash
   dig txt tochimachi.jp | grep spf
   ```

3. **DKIMレコードを確認**
   ```bash
   dig cname s1._domainkey.tochimachi.jp
   ```

4. **SendGrid Activity Feedで配信状況を確認**
   - `Delivered` → 配信成功
   - `Bounce` → 配信失敗
   - `Spam Report` → 迷惑メール報告

### 7.3 リトライが機能しない

**確認項目**:

1. **retryAttempts オプションを確認**
   ```typescript
   await sendEmail({
     to: 'test@example.com',
     subject: 'Test',
     text: 'Test',
     retryAttempts: 5, // 最大5回再試行
   });
   ```

2. **エラーログを確認**
   ```
   [Email] Failed to send (attempt 1/3), retrying in 1000ms...
   [Email] Failed to send (attempt 2/3), retrying in 2000ms...
   [Email] Failed to send after 3 attempts: API rate limit exceeded
   ```

### 7.4 SendGrid API レート制限

**SendGrid無料プラン制限**:
- 100通/日
- 1秒あたり最大3リクエスト

**対処法**:

1. **有料プランへのアップグレード**
   - Essentials: $19.95/月（50,000通/月）
   - Pro: $89.95/月（100,000通/月）

2. **送信頻度を調整**
   ```typescript
   // 各送信間に遅延を追加
   for (const email of emails) {
     await sendEmail(email);
     await sleep(400); // 400ms待機（秒間2.5リクエスト）
   }
   ```

---

## 8. 本番環境での推奨事項

### 8.1 セキュリティ

- [ ] API Keyを環境変数で管理（`.env`ファイルをGit管理しない）
- [ ] 本番環境用とテスト環境用でAPI Keyを分ける
- [ ] API Keyの定期的なローテーション（3ヶ月ごと）
- [ ] `SENDGRID_FROM_EMAIL` がドメイン認証済みドメインであることを確認

### 8.2 監視・ログ

- [ ] SendGrid Activity Feedで配信状況を定期確認
- [ ] 送信失敗時のアラートを設定（管理者アラートメール）
- [ ] 送信ログをデータベースに保存
- [ ] 週次・月次レポートを作成

### 8.3 パフォーマンス

- [ ] 大量送信時はRedis + Bullキューを使用
- [ ] レート制限対策（送信間隔調整）
- [ ] 不要な添付ファイルを削減
- [ ] HTMLメールサイズを最適化（50KB以下推奨）

### 8.4 メールテンプレート管理

- [ ] HTMLメールのモバイル対応確認
- [ ] 各メールクライアントでの表示確認（Gmail, Outlook, Apple Mail等）
- [ ] 配信停止リンクの追加（法令遵守）
- [ ] テンプレート変更時のA/Bテスト

### 8.5 データベース統合（推奨）

```sql
-- メール送信ログテーブル
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_address VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  template_type VARCHAR(100),
  sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL,
  attempts INT DEFAULT 1,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX idx_email_logs_success ON email_logs(success);
CREATE INDEX idx_email_logs_template_type ON email_logs(template_type);
```

---

## 9. よくある質問（FAQ）

### Q1: メールが届かない場合、どこを確認すればよいですか？

**A**: 以下の順序で確認してください:

1. SendGridダッシュボードの Activity Feed で送信ステータスを確認
2. SPF/DKIM認証が完了しているか確認
3. 送信先メールアドレスが正しいか確認
4. 迷惑メールフォルダを確認

### Q2: テストメールを送信する方法は？

**A**: 以下のコマンドを実行:

```bash
# lib/email/send.ts を使用
npm run dev

# または Next.js API Routeを作成
# app/api/test-email/route.ts
```

### Q3: HTMLメールのデザインをカスタマイズできますか？

**A**: はい、各テンプレートファイル（`lib/email/templates/*.ts`）を編集してください。

### Q4: SendGridの料金プランはどれがおすすめですか？

**A**:
- **小規模サイト**: 無料プラン（100通/日）
- **中規模サイト**: Essentials（$19.95/月、50,000通/月）
- **大規模サイト**: Pro以上（$89.95/月〜）

---

## 10. 参考リンク

- [SendGrid公式ドキュメント](https://docs.sendgrid.com/)
- [SendGrid Node.js SDK](https://github.com/sendgrid/sendgrid-nodejs)
- [SPF/DKIM設定ガイド](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication)
- [SendGrid Activity Feed](https://app.sendgrid.com/email_activity)

---

## 11. サポート

問題が解決しない場合は、以下にお問い合わせください:

- **プロジェクト管理者**: admin@tochimachi.jp
- **SendGridサポート**: https://support.sendgrid.com/

---

**最終更新**: 2025年12月2日
**バージョン**: 1.0.0
