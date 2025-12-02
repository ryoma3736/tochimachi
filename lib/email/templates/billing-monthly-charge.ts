/**
 * 業者向けメールテンプレート: 月額課金通知
 * とちまち - 栃木県ポータルサイト
 */

export interface MonthlyChargeData {
  vendorName: string;
  vendorEmail: string;
  billingPeriod: string; // 例: "2025年12月"
  amount: number;
  dueDate: string; // 例: "2025年12月31日"
  planName: string;
  invoiceId: string;
  paymentMethod: string; // 例: "クレジットカード (****1234)"
}

export function generateMonthlyChargeEmail(data: MonthlyChargeData): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `【とちまち】${data.billingPeriod}分の月額料金のお知らせ`;

  const text = `
${data.vendorName} 様

いつもとちまちをご利用いただきありがとうございます。
${data.billingPeriod}分の月額料金をご請求させていただきます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 請求内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
請求期間: ${data.billingPeriod}
プラン: ${data.planName}
請求金額: ¥${data.amount.toLocaleString()}（税込）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お支払い情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
支払方法: ${data.paymentMethod}
お支払期限: ${data.dueDate}
請求書番号: ${data.invoiceId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ご登録のお支払方法で自動的に決済されます。
お支払いに関するご質問は、下記までお問い合わせください。

---
とちまち運営事務局
https://tochimachi.jp
お問い合わせ: billing@tochimachi.jp
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>月額料金のお知らせ</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">月額料金のお知らせ</h1>
    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">${data.billingPeriod}</p>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">${data.vendorName} 様</p>

    <p>いつもとちまちをご利用いただきありがとうございます。<br>
    ${data.billingPeriod}分の月額料金をご請求させていただきます。</p>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
      <h2 style="color: #667eea; font-size: 18px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #667eea;">請求内容</h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; font-weight: bold; color: #666; width: 120px;">請求期間</td>
          <td style="padding: 12px 0;">${data.billingPeriod}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-weight: bold; color: #666;">プラン</td>
          <td style="padding: 12px 0;">${data.planName}</td>
        </tr>
        <tr style="border-top: 2px solid #e0e0e0;">
          <td style="padding: 12px 0; font-weight: bold; color: #667eea; font-size: 16px;">請求金額</td>
          <td style="padding: 12px 0; font-size: 24px; font-weight: bold; color: #667eea;">¥${data.amount.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <div style="background: #e8f4fd; border-left: 4px solid #2196f3; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <h2 style="color: #1976d2; font-size: 18px; margin: 0 0 15px 0;">お支払い情報</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">支払方法</td>
          <td style="padding: 8px 0;">${data.paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">お支払期限</td>
          <td style="padding: 8px 0; color: #d32f2f; font-weight: bold;">${data.dueDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">請求書番号</td>
          <td style="padding: 8px 0; font-family: monospace; color: #666;">${data.invoiceId}</td>
        </tr>
      </table>
    </div>

    <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>自動決済のお知らせ</strong><br>
        ご登録のお支払方法で自動的に決済されます。お支払いに関するご質問は、下記までお問い合わせください。
      </p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <a href="https://tochimachi.jp/vendor/billing" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">請求履歴を確認する</a>
    </div>

    <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center; line-height: 1.8;">
      とちまち運営事務局<br>
      <a href="https://tochimachi.jp" style="color: #667eea; text-decoration: none;">https://tochimachi.jp</a><br>
      お問い合わせ: <a href="mailto:billing@tochimachi.jp" style="color: #667eea; text-decoration: none;">billing@tochimachi.jp</a>
    </p>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}
