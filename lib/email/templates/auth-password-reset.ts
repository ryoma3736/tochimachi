/**
 * 認証メールテンプレート: パスワードリセット
 * とちまち - 栃木県ポータルサイト
 */

export interface PasswordResetData {
  userName: string;
  userEmail: string;
  resetToken: string;
  resetUrl: string;
  expiresAt: string; // 例: "2025年12月3日 15:30"
  ipAddress?: string;
  userAgent?: string;
}

export function generatePasswordResetEmail(data: PasswordResetData): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `【とちまち】パスワードリセットのご案内`;

  const text = `
${data.userName} 様

とちまちのパスワードリセットリクエストを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ パスワードリセット手順
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
以下のリンクをクリックして、新しいパスワードを設定してください。

${data.resetUrl}

※ このリンクは ${data.expiresAt} まで有効です。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ セキュリティ情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.ipAddress ? `リクエスト元IPアドレス: ${data.ipAddress}` : ''}
${data.userAgent ? `使用デバイス: ${data.userAgent}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ このリクエストに心当たりがない場合

もし、このパスワードリセットをリクエストしていない場合は、
このメールを無視してください。
第三者によるアカウントへのアクセスを防ぐため、
パスワードの変更をお勧めします。

不審なアクティビティがある場合は、すぐにご連絡ください。

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
  <title>パスワードリセットのご案内</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">パスワードリセット</h1>
    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">アカウントセキュリティ</p>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">${data.userName} 様</p>

    <p>とちまちのパスワードリセットリクエストを受け付けました。</p>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
      <h2 style="color: #667eea; font-size: 18px; margin: 0 0 15px 0;">🔑 パスワードリセット手順</h2>
      <p style="margin: 0 0 20px 0; color: #555;">
        以下のボタンをクリックして、新しいパスワードを設定してください。
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${data.resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">パスワードをリセットする</a>
      </div>

      <p style="margin: 20px 0 0 0; font-size: 12px; color: #999; text-align: center;">
        ボタンが機能しない場合は、以下のURLをコピーしてブラウザに貼り付けてください:<br>
        <a href="${data.resetUrl}" style="color: #667eea; word-break: break-all; font-family: monospace; font-size: 11px;">${data.resetUrl}</a>
      </p>
    </div>

    <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>⏰ 有効期限</strong><br>
        このリンクは <strong>${data.expiresAt}</strong> まで有効です。<br>
        期限を過ぎた場合は、再度リセットをリクエストしてください。
      </p>
    </div>

    ${
      data.ipAddress || data.userAgent
        ? `
    <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <h3 style="color: #1976d2; font-size: 16px; margin: 0 0 10px 0;">🛡️ セキュリティ情報</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        ${data.ipAddress ? `<tr><td style="padding: 5px 0; color: #555; font-weight: bold; width: 140px;">IPアドレス</td><td style="padding: 5px 0; font-family: monospace;">${data.ipAddress}</td></tr>` : ''}
        ${data.userAgent ? `<tr><td style="padding: 5px 0; color: #555; font-weight: bold;">使用デバイス</td><td style="padding: 5px 0;">${data.userAgent}</td></tr>` : ''}
      </table>
    </div>
    `
        : ''
    }

    <div style="background: #ffebee; border: 2px solid #f44336; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h3 style="color: #c62828; font-size: 16px; margin: 0 0 10px 0;">⚠️ このリクエストに心当たりがない場合</h3>
      <p style="margin: 0; color: #c62828; font-size: 14px; line-height: 1.8;">
        もし、このパスワードリセットをリクエストしていない場合は、このメールを無視してください。<br><br>
        第三者によるアカウントへのアクセスを防ぐため、パスワードの変更をお勧めします。<br><br>
        不審なアクティビティがある場合は、すぐにご連絡ください。
      </p>
    </div>

    <div style="background: #f5f5f5; border-radius: 4px; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; font-size: 13px; color: #666;">
        <strong>セキュリティのヒント:</strong><br>
        • パスワードは8文字以上を使用してください<br>
        • 大文字、小文字、数字、記号を組み合わせてください<br>
        • 他のサービスと同じパスワードを使用しないでください
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
