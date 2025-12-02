/**
 * 認証メールテンプレート: アカウント登録確認
 * とちまち - 栃木県ポータルサイト
 */

export interface AccountVerificationData {
  userName: string;
  userEmail: string;
  verificationToken: string;
  verificationUrl: string;
  accountType: 'customer' | 'vendor';
  expiresAt: string; // 例: "2025年12月3日 15:30"
}

export function generateAccountVerificationEmail(
  data: AccountVerificationData
): {
  subject: string;
  text: string;
  html: string;
} {
  const accountTypeLabel =
    data.accountType === 'vendor' ? '業者アカウント' : 'お客様アカウント';

  const subject = `【とちまち】メールアドレスの確認をお願いします`;

  const text = `
${data.userName} 様

とちまちへのご登録ありがとうございます！
メールアドレスの確認をお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 登録情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
お名前: ${data.userName}
メールアドレス: ${data.userEmail}
アカウント種別: ${accountTypeLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ メールアドレス確認手順
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
以下のリンクをクリックして、メールアドレスの確認を完了してください。

${data.verificationUrl}

※ このリンクは ${data.expiresAt} まで有効です。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

メールアドレスの確認が完了すると、すぐにとちまちの
すべての機能をご利用いただけます。

${
  data.accountType === 'vendor'
    ? `
【業者様向け】
確認後、審査を経て以下の機能がご利用いただけます:
• サービス情報の掲載
• 問い合わせ管理
• 売上レポート確認
• 請求・支払い管理
`
    : `
【お客様向け】
確認後、以下の機能がご利用いただけます:
• 業者様への問い合わせ
• お気に入り登録
• レビュー投稿
• クーポン利用
`
}

このメールに心当たりがない場合は、このメールを無視してください。

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
  <title>メールアドレスの確認</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <div style="font-size: 64px; margin-bottom: 10px;">✉️</div>
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">とちまちへようこそ！</h1>
    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">メールアドレスの確認をお願いします</p>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">${data.userName} 様</p>

    <p>とちまちへのご登録ありがとうございます！<br>
    メールアドレスの確認をお願いいたします。</p>

    <div style="background: #e6f7ed; border-left: 4px solid #48bb78; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <h2 style="color: #38a169; font-size: 18px; margin: 0 0 15px 0;">📝 ご登録情報</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">お名前</td>
          <td style="padding: 8px 0;">${data.userName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">メールアドレス</td>
          <td style="padding: 8px 0; font-family: monospace; color: #667eea;">${data.userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">アカウント種別</td>
          <td style="padding: 8px 0;">${accountTypeLabel}</td>
        </tr>
      </table>
    </div>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
      <h2 style="color: #667eea; font-size: 18px; margin: 0 0 15px 0;">📧 メールアドレス確認手順</h2>
      <p style="margin: 0 0 20px 0; color: #555;">
        以下のボタンをクリックして、メールアドレスの確認を完了してください。
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${data.verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">メールアドレスを確認する</a>
      </div>

      <p style="margin: 20px 0 0 0; font-size: 12px; color: #999; text-align: center;">
        ボタンが機能しない場合は、以下のURLをコピーしてブラウザに貼り付けてください:<br>
        <a href="${data.verificationUrl}" style="color: #667eea; word-break: break-all; font-family: monospace; font-size: 11px;">${data.verificationUrl}</a>
      </p>
    </div>

    <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>⏰ 有効期限</strong><br>
        このリンクは <strong>${data.expiresAt}</strong> まで有効です。
      </p>
    </div>

    <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <h3 style="color: #1976d2; font-size: 16px; margin: 0 0 15px 0;">
        ${data.accountType === 'vendor' ? '💼 業者様向け機能' : '🎁 お客様向け機能'}
      </h3>
      ${
        data.accountType === 'vendor'
          ? `
      <p style="margin: 0 0 10px 0; color: #555; font-size: 14px;">
        確認後、審査を経て以下の機能がご利用いただけます:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px;">
        <li>サービス情報の掲載</li>
        <li>問い合わせ管理</li>
        <li>売上レポート確認</li>
        <li>請求・支払い管理</li>
      </ul>
      `
          : `
      <p style="margin: 0 0 10px 0; color: #555; font-size: 14px;">
        確認後、以下の機能がご利用いただけます:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px;">
        <li>業者様への問い合わせ</li>
        <li>お気に入り登録</li>
        <li>レビュー投稿</li>
        <li>クーポン利用</li>
      </ul>
      `
      }
    </div>

    <div style="background: #f5f5f5; border-radius: 4px; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; font-size: 13px; color: #666; text-align: center;">
        このメールに心当たりがない場合は、このメールを無視してください。
      </p>
    </div>

    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; text-align: center;">
      <p style="font-size: 16px; color: #667eea; font-weight: bold; margin-bottom: 10px;">
        とちまちで素敵な出会いを見つけてください！
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
