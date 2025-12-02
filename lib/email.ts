/**
 * Email送信ユーティリティ (SendGrid)
 * とちまち - 栃木県ポータルサイト
 */

import sgMail from '@sendgrid/mail';

// SendGrid API Key設定
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// デフォルト送信元
const DEFAULT_FROM_EMAIL = 'noreply@tochimachi.jp';
const DEFAULT_FROM_NAME = 'とちまち運営事務局';

/**
 * メール送信ログ
 */
export interface EmailLog {
  to: string;
  subject: string;
  sentAt: Date;
  success: boolean;
  error?: string;
}

/**
 * メール送信オプション
 */
export interface SendEmailOptions {
  to: string;
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
}

/**
 * メール送信（汎用）
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<EmailLog> {
  const log: EmailLog = {
    to: options.to,
    subject: options.subject,
    sentAt: new Date(),
    success: false,
  };

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

    console.log(`[Email] Sent successfully to ${options.to}`);
  } catch (error) {
    log.success = false;
    log.error = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Failed to send:', log.error);
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
  }

  return logs;
}

/**
 * 業者向けメール: 新規問い合わせ通知
 */
export interface InquiryNotificationData {
  vendorName: string;
  vendorEmail: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  message: string;
  services: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  inquiryId: string;
}

export async function sendInquiryNotificationToVendor(
  data: InquiryNotificationData
): Promise<EmailLog> {
  const servicesText = data.services
    .map((s) => `  - ${s.name} × ${s.quantity}個 (¥${s.price.toLocaleString()})`)
    .join('\n');

  const text = `
${data.vendorName} 様

とちまちから新しいお問い合わせが届きました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お客様情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
お名前: ${data.customerName}
${data.customerPhone ? `電話番号: ${data.customerPhone}` : ''}
${data.customerEmail ? `メールアドレス: ${data.customerEmail}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ ご希望のサービス
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${servicesText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

お客様へのご連絡をお願いいたします。

問い合わせID: ${data.inquiryId}

---
とちまち運営事務局
https://tochimachi.jp
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>新規問い合わせ通知</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">【とちまち】新しいお問い合わせ</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">${data.vendorName} 様</p>

    <p>とちまちから新しいお問い合わせが届きました。</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h2 style="color: #667eea; font-size: 18px; margin-top: 0;">お客様情報</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 120px;">お名前</td>
          <td style="padding: 8px 0;">${data.customerName}</td>
        </tr>
        ${data.customerPhone ? `<tr><td style="padding: 8px 0; font-weight: bold;">電話番号</td><td style="padding: 8px 0;">${data.customerPhone}</td></tr>` : ''}
        ${data.customerEmail ? `<tr><td style="padding: 8px 0; font-weight: bold;">メール</td><td style="padding: 8px 0;">${data.customerEmail}</td></tr>` : ''}
      </table>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #764ba2;">
      <h2 style="color: #764ba2; font-size: 18px; margin-top: 0;">お問い合わせ内容</h2>
      <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #48bb78;">
      <h2 style="color: #48bb78; font-size: 18px; margin-top: 0;">ご希望のサービス</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${data.services.map((s) => `<li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <strong>${s.name}</strong> × ${s.quantity}個
          <span style="float: right; color: #667eea; font-weight: bold;">¥${s.price.toLocaleString()}</span>
        </li>`).join('')}
      </ul>
    </div>

    <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
      <strong>お客様へのご連絡をお願いいたします。</strong>
    </p>

    <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
      問い合わせID: ${data.inquiryId}<br>
      とちまち運営事務局<br>
      <a href="https://tochimachi.jp" style="color: #667eea;">https://tochimachi.jp</a>
    </p>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: data.vendorEmail,
    subject: '【とちまち】新しいお問い合わせが届きました',
    text,
    html,
  });
}

/**
 * 顧客向けメール: 問い合わせ受付確認
 */
export interface InquiryConfirmationData {
  customerName: string;
  customerEmail: string;
  vendorName: string;
  message: string;
  services: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  inquiryId: string;
}

export async function sendInquiryConfirmationToCustomer(
  data: InquiryConfirmationData
): Promise<EmailLog> {
  const servicesText = data.services
    .map((s) => `  - ${s.name} × ${s.quantity}個 (¥${s.price.toLocaleString()})`)
    .join('\n');

  const text = `
${data.customerName} 様

この度は、とちまちをご利用いただきありがとうございます。
お問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ先
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.vendorName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ ご希望のサービス
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${servicesText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

業者様からの返信をお待ちください。
通常、1〜3営業日以内にご連絡いたします。

問い合わせID: ${data.inquiryId}

---
とちまち運営事務局
https://tochimachi.jp
お問い合わせ: support@tochimachi.jp
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせ受付確認</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">【とちまち】お問い合わせ受付</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">${data.customerName} 様</p>

    <p>この度は、とちまちをご利用いただきありがとうございます。<br>
    お問い合わせを受け付けました。</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h2 style="color: #667eea; font-size: 18px; margin-top: 0;">お問い合わせ先</h2>
      <p style="font-size: 18px; font-weight: bold; margin: 0;">${data.vendorName}</p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #764ba2;">
      <h2 style="color: #764ba2; font-size: 18px; margin-top: 0;">お問い合わせ内容</h2>
      <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #48bb78;">
      <h2 style="color: #48bb78; font-size: 18px; margin-top: 0;">ご希望のサービス</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${data.services.map((s) => `<li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <strong>${s.name}</strong> × ${s.quantity}個
          <span style="float: right; color: #667eea; font-weight: bold;">¥${s.price.toLocaleString()}</span>
        </li>`).join('')}
      </ul>
    </div>

    <div style="background: #e6f7ff; border: 1px solid #91d5ff; border-radius: 4px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #0050b3;">
        <strong>業者様からの返信をお待ちください。</strong><br>
        通常、1〜3営業日以内にご連絡いたします。
      </p>
    </div>

    <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
      問い合わせID: ${data.inquiryId}<br>
      とちまち運営事務局<br>
      <a href="https://tochimachi.jp" style="color: #667eea;">https://tochimachi.jp</a><br>
      お問い合わせ: <a href="mailto:support@tochimachi.jp" style="color: #667eea;">support@tochimachi.jp</a>
    </p>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: data.customerEmail,
    subject: '【とちまち】お問い合わせを受け付けました',
    text,
    html,
  });
}

/**
 * 業者向けメール: 返信通知（顧客に返信があった時）
 */
export interface ReplyNotificationData {
  customerName: string;
  customerEmail: string;
  vendorName: string;
  reply: string;
  originalMessage: string;
  inquiryId: string;
}

export async function sendReplyNotificationToCustomer(
  data: ReplyNotificationData
): Promise<EmailLog> {
  const text = `
${data.customerName} 様

${data.vendorName} 様からお返事が届きました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 返信内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.reply}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ あなたのお問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.originalMessage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

問い合わせID: ${data.inquiryId}

---
とちまち運営事務局
https://tochimachi.jp
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>業者様からの返信</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">【とちまち】業者様からの返信</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">${data.customerName} 様</p>

    <p><strong>${data.vendorName}</strong> 様からお返事が届きました。</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #48bb78;">
      <h2 style="color: #48bb78; font-size: 18px; margin-top: 0;">返信内容</h2>
      <p style="white-space: pre-wrap; margin: 0;">${data.reply}</p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #cbd5e0;">
      <h2 style="color: #718096; font-size: 18px; margin-top: 0;">あなたのお問い合わせ内容</h2>
      <p style="white-space: pre-wrap; margin: 0; color: #718096;">${data.originalMessage}</p>
    </div>

    <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
      問い合わせID: ${data.inquiryId}<br>
      とちまち運営事務局<br>
      <a href="https://tochimachi.jp" style="color: #667eea;">https://tochimachi.jp</a>
    </p>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: data.customerEmail,
    subject: `【とちまち】${data.vendorName} 様からの返信`,
    text,
    html,
  });
}
