/**
 * 業者向けメールテンプレート: 審査承認通知
 * とちまち - 栃木県ポータルサイト
 */

export interface ApprovalNotificationData {
  vendorName: string;
  vendorEmail: string;
  approvalDate: string;
  planName: string;
  monthlyFee: number;
  dashboardUrl: string;
  nextSteps: string[];
}

export function generateApprovalEmail(data: ApprovalNotificationData): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `【とちまち】審査承認のお知らせ - サービス開始手続きのご案内`;

  const text = `
${data.vendorName} 様

この度は、とちまちにご登録いただき誠にありがとうございます。
審査の結果、貴社のご登録が承認されましたのでお知らせいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 承認内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
承認日: ${data.approvalDate}
ご契約プラン: ${data.planName}
月額料金: ¥${data.monthlyFee.toLocaleString()}（税込）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 今後の流れ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

業者様専用ダッシュボードから、サービス情報の編集や問い合わせ管理ができます。

ダッシュボードURL: ${data.dashboardUrl}

ご不明な点がございましたら、お気軽にお問い合わせください。
今後ともとちまちをよろしくお願いいたします。

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
  <title>審査承認のお知らせ</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <div style="font-size: 64px; margin-bottom: 10px;">🎉</div>
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">審査承認おめでとうございます！</h1>
    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">サービス開始の準備が整いました</p>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">${data.vendorName} 様</p>

    <p>この度は、とちまちにご登録いただき誠にありがとうございます。<br>
    審査の結果、貴社のご登録が<strong style="color: #48bb78;">承認されました</strong>のでお知らせいたします。</p>

    <div style="background: #e6f7ed; border-left: 4px solid #48bb78; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <h2 style="color: #38a169; font-size: 18px; margin: 0 0 15px 0;">✅ 承認内容</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">承認日</td>
          <td style="padding: 8px 0;">${data.approvalDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">ご契約プラン</td>
          <td style="padding: 8px 0; font-weight: bold; color: #48bb78;">${data.planName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">月額料金</td>
          <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #667eea;">¥${data.monthlyFee.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
      <h2 style="color: #667eea; font-size: 18px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #667eea;">📋 今後の流れ</h2>
      <ol style="margin: 0; padding-left: 20px; color: #555; line-height: 2;">
        ${data.nextSteps.map((step) => `<li style="margin-bottom: 10px;">${step}</li>`).join('')}
      </ol>
    </div>

    <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <h3 style="color: #1976d2; font-size: 16px; margin: 0 0 10px 0;">💼 業者様専用ダッシュボード</h3>
      <p style="margin: 0 0 15px 0; color: #555; font-size: 14px;">
        以下の機能をご利用いただけます:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px;">
        <li>サービス情報の編集</li>
        <li>問い合わせ管理</li>
        <li>売上レポート確認</li>
        <li>請求・支払い履歴</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${data.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">ダッシュボードを開く</a>
    </div>

    <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>サポート体制について</strong><br>
        ご不明な点がございましたら、お気軽にお問い合わせください。<br>
        専任スタッフがサポートいたします。
      </p>
    </div>

    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; text-align: center;">
      <p style="font-size: 16px; color: #48bb78; font-weight: bold; margin-bottom: 10px;">
        今後ともとちまちをよろしくお願いいたします！
      </p>
    </div>

    <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center; line-height: 1.8;">
      とちまち運営事務局<br>
      <a href="https://tochimachi.jp" style="color: #667eea; text-decoration: none;">https://tochimachi.jp</a><br>
      お問い合わせ: <a href="mailto:support@tochimachi.jp" style="color: #667eea; text-decoration: none;">support@tochimachi.jp</a>
    </p>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}
