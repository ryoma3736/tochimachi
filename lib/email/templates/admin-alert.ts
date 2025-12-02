/**
 * 管理者向けメールテンプレート: システムアラート通知
 * とちまち - 栃木県ポータルサイト
 */

export interface AdminAlertData {
  alertType: 'error' | 'warning' | 'info' | 'critical';
  alertTitle: string;
  alertMessage: string;
  timestamp: string;
  source?: string; // 例: "Payment System", "User Registration"
  details?: Record<string, unknown>;
  actionRequired?: string;
  affectedUsers?: number;
  stackTrace?: string;
}

export function generateAdminAlertEmail(data: AdminAlertData): {
  subject: string;
  text: string;
  html: string;
} {
  const alertTypeLabels = {
    critical: '🚨 CRITICAL',
    error: '❌ ERROR',
    warning: '⚠️ WARNING',
    info: 'ℹ️ INFO',
  };

  const alertColors = {
    critical: '#d32f2f',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
  };

  const alertLabel = alertTypeLabels[data.alertType];
  const alertColor = alertColors[data.alertType];

  const subject = `【とちまち管理】${alertLabel} - ${data.alertTitle}`;

  const detailsText = data.details
    ? Object.entries(data.details)
        .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
        .join('\n')
    : '';

  const text = `
${alertLabel}: ${data.alertTitle}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ アラート詳細
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
発生日時: ${data.timestamp}
${data.source ? `発生源: ${data.source}` : ''}
${data.affectedUsers ? `影響ユーザー数: ${data.affectedUsers}人` : ''}

メッセージ:
${data.alertMessage}

${detailsText ? `詳細情報:\n${detailsText}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${
  data.actionRequired
    ? `
■ 必要な対応
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.actionRequired}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
    : ''
}
${
  data.stackTrace
    ? `
■ スタックトレース
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.stackTrace}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
    : ''
}

管理ダッシュボード: https://tochimachi.jp/admin

---
とちまち管理システム
自動送信メール
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>システムアラート通知</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: ${alertColor}; color: white; padding: 25px 20px; border-radius: 8px 8px 0 0; border-bottom: 4px solid ${alertColor};">
    <div style="font-size: 48px; margin-bottom: 10px; text-align: center;">${alertLabel.split(' ')[0]}</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 600; text-align: center;">${data.alertTitle}</h1>
    <p style="margin: 10px 0 0 0; font-size: 13px; opacity: 0.9; text-align: center;">${data.alertType.toUpperCase()} ALERT</p>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">

    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 0 0 25px 0; border-left: 4px solid ${alertColor};">
      <h2 style="color: ${alertColor}; font-size: 18px; margin: 0 0 15px 0;">📋 アラート詳細</h2>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #666; width: 140px; vertical-align: top;">発生日時</td>
          <td style="padding: 10px 0; font-family: monospace;">${data.timestamp}</td>
        </tr>
        ${data.source ? `<tr><td style="padding: 10px 0; font-weight: bold; color: #666; vertical-align: top;">発生源</td><td style="padding: 10px 0;">${data.source}</td></tr>` : ''}
        ${data.affectedUsers ? `<tr><td style="padding: 10px 0; font-weight: bold; color: #666; vertical-align: top;">影響ユーザー数</td><td style="padding: 10px 0; color: ${alertColor}; font-weight: bold;">${data.affectedUsers}人</td></tr>` : ''}
      </table>

      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <h3 style="color: #555; font-size: 15px; margin: 0 0 10px 0;">メッセージ</h3>
        <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.8; white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; border: 1px solid #e0e0e0;">${data.alertMessage}</p>
      </div>

      ${
        data.details && Object.keys(data.details).length > 0
          ? `
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <h3 style="color: #555; font-size: 15px; margin: 0 0 10px 0;">詳細情報</h3>
        <div style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #e0e0e0; font-family: monospace; font-size: 12px; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            ${Object.entries(data.details)
              .map(
                ([key, value]) => `
            <tr>
              <td style="padding: 5px 10px 5px 0; color: #667eea; font-weight: bold; vertical-align: top; white-space: nowrap;">${key}:</td>
              <td style="padding: 5px 0; color: #333; word-break: break-all;">${JSON.stringify(value)}</td>
            </tr>
            `
              )
              .join('')}
          </table>
        </div>
      </div>
      `
          : ''
      }
    </div>

    ${
      data.actionRequired
        ? `
    <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h2 style="color: #f57c00; font-size: 18px; margin: 0 0 15px 0;">⚡ 必要な対応</h2>
      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${data.actionRequired}</p>
    </div>
    `
        : ''
    }

    ${
      data.stackTrace
        ? `
    <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h3 style="color: #555; font-size: 15px; margin: 0 0 15px 0;">🔍 スタックトレース</h3>
      <pre style="margin: 0; font-family: 'Monaco', 'Courier New', monospace; font-size: 11px; color: #333; line-height: 1.5; overflow-x: auto; background: white; padding: 15px; border-radius: 4px; border: 1px solid #e0e0e0;">${data.stackTrace}</pre>
    </div>
    `
        : ''
    }

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
      <a href="https://tochimachi.jp/admin" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 15px;">管理ダッシュボードを開く</a>
    </div>

    <div style="background: #f5f5f5; border-radius: 4px; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
        このアラートは自動的に送信されています。<br>
        適切な対応を行った後、必要に応じてアラートを確認済みとしてマークしてください。
      </p>
    </div>

    <p style="font-size: 11px; color: #999; margin-top: 30px; text-align: center; line-height: 1.8;">
      とちまち管理システム<br>
      <a href="https://tochimachi.jp/admin" style="color: #667eea; text-decoration: none;">https://tochimachi.jp/admin</a><br>
      このメールは自動送信されています
    </p>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}
