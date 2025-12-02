/**
 * 強化版メール送信ユーティリティ
 * リトライ機能・送信ログ・型安全なテンプレート統合
 * とちまち - 栃木県ポータルサイト
 */

import sgMail from '@sendgrid/mail';
import {
  generateMonthlyChargeEmail,
  type MonthlyChargeData,
  generatePaymentFailureEmail,
  type PaymentFailureData,
  generateApprovalEmail,
  type ApprovalNotificationData,
  generatePasswordResetEmail,
  type PasswordResetData,
  generateAccountVerificationEmail,
  type AccountVerificationData,
  generateAdminAlertEmail,
  type AdminAlertData,
  generateWaitlistNotificationEmail,
  type WaitlistNotificationData,
  generateWaitlistRegisteredEmail,
  type WaitlistRegisteredData,
} from './templates';

// SendGrid API Key設定
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// デフォルト送信元
const DEFAULT_FROM_EMAIL =
  process.env.SENDGRID_FROM_EMAIL || 'noreply@tochimachi.jp';
const DEFAULT_FROM_NAME = 'とちまち運営事務局';

// 管理者メールアドレス
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tochimachi.jp';

/**
 * メール送信ログ
 */
export interface EmailLog {
  to: string;
  subject: string;
  sentAt: Date;
  success: boolean;
  error?: string;
  attempts: number;
  templateType?: string;
}

/**
 * メール送信オプション
 */
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: {
    email: string;
    name?: string;
  };
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  attachments?: Array<{
    content: string; // Base64エンコード
    filename: string;
    type: string;
    disposition: 'attachment' | 'inline';
  }>;
  templateType?: string;
  retryAttempts?: number; // デフォルト: 3
  retryDelay?: number; // ミリ秒、デフォルト: 1000
}

/**
 * リトライ付きメール送信（汎用）
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<EmailLog> {
  const maxAttempts = options.retryAttempts ?? 3;
  const retryDelay = options.retryDelay ?? 1000;

  const log: EmailLog = {
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    sentAt: new Date(),
    success: false,
    attempts: 0,
    templateType: options.templateType,
  };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    log.attempts = attempt;

    try {
      if (!SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY is not configured');
      }

      const from = options.from || {
        email: DEFAULT_FROM_EMAIL,
        name: DEFAULT_FROM_NAME,
      };

      const msg = {
        to: options.to,
        from: {
          email: from.email,
          name: from.name,
        },
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        attachments: options.attachments,
      } as sgMail.MailDataRequired;

      await sgMail.send(msg);
      log.success = true;

      console.log(
        `[Email] Sent successfully to ${log.to} (attempt ${attempt}/${maxAttempts})`
      );

      return log;
    } catch (error) {
      log.error = error instanceof Error ? error.message : 'Unknown error';

      if (attempt < maxAttempts) {
        console.warn(
          `[Email] Failed to send (attempt ${attempt}/${maxAttempts}), retrying in ${retryDelay}ms...`,
          log.error
        );
        await sleep(retryDelay * attempt); // 指数バックオフ
      } else {
        console.error(
          `[Email] Failed to send after ${maxAttempts} attempts:`,
          log.error
        );
      }
    }
  }

  return log;
}

/**
 * 複数宛先に一括送信
 */
export async function sendBulkEmails(
  emails: SendEmailOptions[]
): Promise<EmailLog[]> {
  const logs: EmailLog[] = [];

  for (const emailOptions of emails) {
    const log = await sendEmail(emailOptions);
    logs.push(log);

    // レート制限対策: 各送信間に少し待機
    if (emails.length > 1) {
      await sleep(100);
    }
  }

  return logs;
}

/**
 * 型安全なテンプレートメール送信関数群
 */

/**
 * 業者向け: 月額課金通知
 */
export async function sendMonthlyChargeEmail(
  data: MonthlyChargeData
): Promise<EmailLog> {
  const { subject, text, html } = generateMonthlyChargeEmail(data);

  return sendEmail({
    to: data.vendorEmail,
    subject,
    text,
    html,
    templateType: 'billing-monthly-charge',
  });
}

/**
 * 業者向け: 課金失敗警告
 */
export async function sendPaymentFailureEmail(
  data: PaymentFailureData
): Promise<EmailLog> {
  const { subject, text, html } = generatePaymentFailureEmail(data);

  return sendEmail({
    to: data.vendorEmail,
    subject,
    text,
    html,
    templateType: 'billing-payment-failure',
  });
}

/**
 * 業者向け: 審査承認通知
 */
export async function sendApprovalEmail(
  data: ApprovalNotificationData
): Promise<EmailLog> {
  const { subject, text, html } = generateApprovalEmail(data);

  return sendEmail({
    to: data.vendorEmail,
    subject,
    text,
    html,
    templateType: 'billing-approval',
  });
}

/**
 * 顧客向け: パスワードリセット
 */
export async function sendPasswordResetEmail(
  data: PasswordResetData
): Promise<EmailLog> {
  const { subject, text, html } = generatePasswordResetEmail(data);

  return sendEmail({
    to: data.userEmail,
    subject,
    text,
    html,
    templateType: 'auth-password-reset',
  });
}

/**
 * 顧客向け: アカウント登録確認
 */
export async function sendAccountVerificationEmail(
  data: AccountVerificationData
): Promise<EmailLog> {
  const { subject, text, html } = generateAccountVerificationEmail(data);

  return sendEmail({
    to: data.userEmail,
    subject,
    text,
    html,
    templateType: 'auth-account-verification',
  });
}

/**
 * 管理者向け: システムアラート通知
 */
export async function sendAdminAlertEmail(
  data: AdminAlertData
): Promise<EmailLog> {
  const { subject, text, html } = generateAdminAlertEmail(data);

  return sendEmail({
    to: ADMIN_EMAIL,
    subject,
    text,
    html,
    templateType: 'admin-alert',
    retryAttempts: 5, // 管理者通知は重要なので5回まで再試行
  });
}

/**
 * ユーティリティ: スリープ関数
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * メール送信キュー（オプション機能）
 * 本番環境では Redis + Bull を使用することを推奨
 */
interface QueuedEmail {
  id: string;
  options: SendEmailOptions;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  error?: string;
}

class EmailQueue {
  private queue: QueuedEmail[] = [];
  private processing = false;

  /**
   * メールをキューに追加
   */
  enqueue(options: SendEmailOptions): string {
    const id = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const queuedEmail: QueuedEmail = {
      id,
      options,
      status: 'pending',
      createdAt: new Date(),
    };

    this.queue.push(queuedEmail);
    console.log(`[EmailQueue] Added email to queue: ${id}`);

    // 自動処理開始
    if (!this.processing) {
      this.process();
    }

    return id;
  }

  /**
   * キューを処理
   */
  private async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const email = this.queue.find((e) => e.status === 'pending');
      if (!email) break;

      email.status = 'processing';
      console.log(`[EmailQueue] Processing email: ${email.id}`);

      try {
        const log = await sendEmail(email.options);

        if (log.success) {
          email.status = 'completed';
        } else {
          email.status = 'failed';
          email.error = log.error;
        }

        email.processedAt = new Date();
      } catch (error) {
        email.status = 'failed';
        email.error = error instanceof Error ? error.message : 'Unknown error';
        email.processedAt = new Date();
      }

      // 処理済みメールを保持（ログとして）
      // 本番環境ではDBに保存することを推奨
    }

    this.processing = false;
  }

  /**
   * キューの状態を取得
   */
  getStatus(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    return {
      pending: this.queue.filter((e) => e.status === 'pending').length,
      processing: this.queue.filter((e) => e.status === 'processing').length,
      completed: this.queue.filter((e) => e.status === 'completed').length,
      failed: this.queue.filter((e) => e.status === 'failed').length,
    };
  }

  /**
   * 完了・失敗済みメールをクリア
   */
  clear() {
    const beforeCount = this.queue.length;
    this.queue = this.queue.filter(
      (e) => e.status === 'pending' || e.status === 'processing'
    );
    console.log(
      `[EmailQueue] Cleared ${beforeCount - this.queue.length} processed emails`
    );
  }
}

// シングルトンインスタンス
export const emailQueue = new EmailQueue();

/**
 * キュー経由でメール送信
 */
export function sendEmailQueued(options: SendEmailOptions): string {
  return emailQueue.enqueue(options);
}

/**
 * ウェイトリスト向け: 空き通知メール
 */
export async function sendWaitlistNotificationEmail(
  data: WaitlistNotificationData
): Promise<EmailLog> {
  const { subject, text, html } = generateWaitlistNotificationEmail(data);

  return sendEmail({
    to: data.email,
    subject,
    text,
    html,
    templateType: 'waitlist-notification',
    retryAttempts: 5, // 重要な通知なので5回まで再試行
  });
}

/**
 * ウェイトリスト向け: 登録完了メール
 */
export async function sendWaitlistRegisteredEmail(
  data: WaitlistRegisteredData
): Promise<EmailLog> {
  const { subject, text, html } = generateWaitlistRegisteredEmail(data);

  return sendEmail({
    to: data.email,
    subject,
    text,
    html,
    templateType: 'waitlist-registered',
  });
}
