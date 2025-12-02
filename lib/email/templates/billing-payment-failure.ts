/**
 * 業者向けメールテンプレート: 課金失敗警告
 * とちまち - 栃木県ポータルサイト
 */

export interface PaymentFailureData {
  vendorName: string;
  vendorEmail: string;
  amount: number;
  failedDate: string;
  reason: string;
  retryDate: string;
  planName: string;
  invoiceId: string;
  suspensionDate?: string; // サービス停止予定日
}

export function generatePaymentFailureEmail(data: PaymentFailureData): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `【重要】とちまち - お支払いが完了しませんでした`;

  const text = `
${data.vendorName} 様

とちまちの月額料金のお支払いが完了しませんでした。
お早めにお支払い方法のご確認をお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 決済失敗情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
請求金額: ¥${data.amount.toLocaleString()}（税込）
プラン: ${data.planName}
失敗日時: ${data.failedDate}
失敗理由: ${data.reason}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 次回の自動決済
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
次回リトライ日: ${data.retryDate}
請求書番号: ${data.invoiceId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${
  data.suspensionDate
    ? `
⚠️ 重要なお知らせ
${data.suspensionDate}までにお支払いが確認できない場合、
サービスが一時停止となります。
`
    : ''
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【対処方法】
1. お支払い方法（クレジットカード等）の有効性を確認
2. 残高・利用限度額を確認
3. 問題が解決しない場合は、お支払い方法を更新してください

管理画面: https://tochimachi.jp/vendor/billing

ご不明な点がございましたら、お気軽にお問い合わせください。

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
  <title>お支払いが完了しませんでした</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">お支払いが完了しませんでした</h1>
    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">早急な対応が必要です</p>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">${data.vendorName} 様</p>

    <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <p style="margin: 0; color: #c62828; font-weight: bold; font-size: 15px;">
        とちまちの月額料金のお支払いが完了しませんでした。<br>
        お早めにお支払い方法のご確認をお願いいたします。
      </p>
    </div>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
      <h2 style="color: #f44336; font-size: 18px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #f44336;">決済失敗情報</h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; font-weight: bold; color: #666; width: 120px;">請求金額</td>
          <td style="padding: 12px 0; font-size: 20px; font-weight: bold; color: #f44336;">¥${data.amount.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-weight: bold; color: #666;">プラン</td>
          <td style="padding: 12px 0;">${data.planName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-weight: bold; color: #666;">失敗日時</td>
          <td style="padding: 12px 0;">${data.failedDate}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-weight: bold; color: #666;">失敗理由</td>
          <td style="padding: 12px 0; color: #d32f2f;">${data.reason}</td>
        </tr>
      </table>
    </div>

    <div style="background: #fff3cd; border-left: 4px solid #ff9800; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <h2 style="color: #f57c00; font-size: 18px; margin: 0 0 15px 0;">次回の自動決済</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">次回リトライ日</td>
          <td style="padding: 8px 0; color: #f57c00; font-weight: bold;">${data.retryDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">請求書番号</td>
          <td style="padding: 8px 0; font-family: monospace;">${data.invoiceId}</td>
        </tr>
      </table>
    </div>

    ${
      data.suspensionDate
        ? `
    <div style="background: #ffebee; border: 2px solid #f44336; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h3 style="color: #c62828; font-size: 18px; margin: 0 0 10px 0;">⚠️ 重要なお知らせ</h3>
      <p style="margin: 0; color: #c62828; font-size: 15px; line-height: 1.8;">
        <strong>${data.suspensionDate}まで</strong>にお支払いが確認できない場合、<br>
        サービスが<strong>一時停止</strong>となります。
      </p>
    </div>
    `
        : ''
    }

    <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <h3 style="color: #1976d2; font-size: 16px; margin: 0 0 15px 0;">対処方法</h3>
      <ol style="margin: 0; padding-left: 20px; color: #555;">
        <li style="margin-bottom: 10px;">お支払い方法（クレジットカード等）の有効性を確認</li>
        <li style="margin-bottom: 10px;">残高・利用限度額を確認</li>
        <li>問題が解決しない場合は、お支払い方法を更新してください</li>
      </ol>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://tochimachi.jp/vendor/billing" style="display: inline-block; background: #2196f3; color: white; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">お支払い方法を確認・更新する</a>
    </div>

    <div style="background: #f5f5f5; border-radius: 4px; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; font-size: 13px; color: #666;">
        ご不明な点がございましたら、お気軽にお問い合わせください。<br>
        お客様のサービス継続をサポートいたします。
      </p>
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
