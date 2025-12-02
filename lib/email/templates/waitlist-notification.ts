/**
 * ウェイトリスト空き通知メールテンプレート
 * とちまち - 栃木県ポータルサイト
 */

import { formatDate } from '@/lib/utils';

export interface WaitlistNotificationData {
  companyName: string;
  email: string;
  categoryName: string;
  position: number;
  expiresAt: Date;
  registrationUrl: string;
}

export function generateWaitlistNotificationEmail(
  data: WaitlistNotificationData
): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = '【とちまち】登録枠が空きました！7日以内にご登録ください';

  const text = `
${data.companyName} 様

いつもとちまちをご利用いただき、誠にありがとうございます。

お待たせいたしました！
業者登録の枠が空きましたので、ご案内させていただきます。

■ 登録情報
━━━━━━━━━━━━━━━━━━━━━━
会社名: ${data.companyName}
メールアドレス: ${data.email}
業種: ${data.categoryName}
ウェイトリスト順位: 第${data.position}位
━━━━━━━━━━━━━━━━━━━━━━

■ 重要なお知らせ
━━━━━━━━━━━━━━━━━━━━━━
登録期限: ${formatDate(data.expiresAt)} まで（7日間）

この期限までに業者登録を完了していただく必要がございます。
期限を過ぎると、次の順位の方に繰り上げとなりますのでご注意ください。
━━━━━━━━━━━━━━━━━━━━━━

■ 登録手順
━━━━━━━━━━━━━━━━━━━━━━
1. 下記のURLにアクセス
2. 業者登録フォームに情報を入力
3. 初期費用（月額12万円）の決済手続き
4. 審査完了後、サービス開始

【業者登録URL】
${data.registrationUrl}
━━━━━━━━━━━━━━━━━━━━━━

■ 料金について
━━━━━━━━━━━━━━━━━━━━━━
・月額料金: 120,000円（税込）
・初月: 登録完了月の日割り計算
・決済方法: クレジットカード（Stripe経由）
━━━━━━━━━━━━━━━━━━━━━━

■ サービス内容
━━━━━━━━━━━━━━━━━━━━━━
✓ 業者ページの掲載
✓ サービス・料金メニューの登録
✓ Instagram連携機能
✓ 問い合わせ管理機能
✓ 月次レポート
━━━━━━━━━━━━━━━━━━━━━━

ご不明な点がございましたら、お気軽にお問い合わせください。

━━━━━━━━━━━━━━━━━━━━━━
とちまち運営事務局
Email: support@tochimachi.jp
URL: https://tochimachi.jp
━━━━━━━━━━━━━━━━━━━━━━

※このメールは自動送信されています。
※返信いただいても対応できませんので、お問い合わせは上記メールアドレスまでお願いいたします。
`;

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
      line-height: 1.8;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .alert-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .alert-box strong {
      color: #856404;
      display: block;
      margin-bottom: 8px;
      font-size: 18px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .info-table th,
    .info-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    .info-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      width: 40%;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 30px 0;
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }
    .feature-list {
      list-style: none;
      padding: 0;
    }
    .feature-list li {
      padding: 8px 0 8px 30px;
      position: relative;
    }
    .feature-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #28a745;
      font-weight: bold;
      font-size: 18px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 登録枠が空きました！</h1>
    </div>

    <div class="content">
      <div class="greeting">
        ${data.companyName} 様
      </div>

      <p>いつもとちまちをご利用いただき、誠にありがとうございます。</p>

      <p>お待たせいたしました！<br>
      業者登録の枠が空きましたので、ご案内させていただきます。</p>

      <div class="alert-box">
        <strong>⚠️ 登録期限</strong>
        ${formatDate(data.expiresAt)} まで（7日間）<br>
        期限を過ぎると次の順位の方に繰り上げとなります。
      </div>

      <div class="section">
        <div class="section-title">登録情報</div>
        <table class="info-table">
          <tr>
            <th>会社名</th>
            <td>${data.companyName}</td>
          </tr>
          <tr>
            <th>メールアドレス</th>
            <td>${data.email}</td>
          </tr>
          <tr>
            <th>業種</th>
            <td>${data.categoryName}</td>
          </tr>
          <tr>
            <th>ウェイトリスト順位</th>
            <td>第${data.position}位</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center;">
        <a href="${data.registrationUrl}" class="cta-button">
          今すぐ業者登録する →
        </a>
      </div>

      <div class="section">
        <div class="section-title">料金について</div>
        <table class="info-table">
          <tr>
            <th>月額料金</th>
            <td>120,000円（税込）</td>
          </tr>
          <tr>
            <th>初月</th>
            <td>登録完了月の日割り計算</td>
          </tr>
          <tr>
            <th>決済方法</th>
            <td>クレジットカード（Stripe経由）</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">サービス内容</div>
        <ul class="feature-list">
          <li>業者ページの掲載</li>
          <li>サービス・料金メニューの登録</li>
          <li>Instagram連携機能</li>
          <li>問い合わせ管理機能</li>
          <li>月次レポート</li>
        </ul>
      </div>

      <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
    </div>

    <div class="footer">
      <p><strong>とちまち運営事務局</strong></p>
      <p>
        Email: <a href="mailto:support@tochimachi.jp">support@tochimachi.jp</a><br>
        URL: <a href="https://tochimachi.jp">https://tochimachi.jp</a>
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 20px;">
        ※このメールは自動送信されています。<br>
        ※返信いただいても対応できませんので、お問い合わせは上記メールアドレスまでお願いいたします。
      </p>
    </div>
  </div>
</body>
</html>
`;

  return { subject, text, html };
}

/**
 * ウェイトリスト登録完了メールテンプレート
 */
export interface WaitlistRegisteredData {
  companyName: string;
  email: string;
  categoryName: string;
  position: number;
}

export function generateWaitlistRegisteredEmail(
  data: WaitlistRegisteredData
): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = '【とちまち】ウェイトリスト登録完了のお知らせ';

  const text = `
${data.companyName} 様

この度は「とちまち」のウェイトリストにご登録いただき、誠にありがとうございます。

■ 登録情報
━━━━━━━━━━━━━━━━━━━━━━
会社名: ${data.companyName}
メールアドレス: ${data.email}
業種: ${data.categoryName}
現在の順位: 第${data.position}位
━━━━━━━━━━━━━━━━━━━━━━

■ 今後の流れ
━━━━━━━━━━━━━━━━━━━━━━
1. 業者登録の枠が空き次第、順番にご案内いたします
2. 空き通知メールを受信後、7日以内に本登録をお願いいたします
3. 登録完了後、審査を経てサービス開始となります
━━━━━━━━━━━━━━━━━━━━━━

■ ご注意事項
━━━━━━━━━━━━━━━━━━━━━━
・空き通知メールは受信後7日間有効です
・期限内に登録されない場合、次の順位の方に繰り上げとなります
・順位は前後する場合がございます
━━━━━━━━━━━━━━━━━━━━━━

空き枠のご案内をお待ちください。

━━━━━━━━━━━━━━━━━━━━━━
とちまち運営事務局
Email: support@tochimachi.jp
URL: https://tochimachi.jp
━━━━━━━━━━━━━━━━━━━━━━
`;

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
      line-height: 1.8;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .info-box {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .info-box h3 {
      margin-top: 0;
      color: #667eea;
      font-size: 18px;
    }
    .position-badge {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 10px 20px;
      border-radius: 50px;
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ ウェイトリスト登録完了</h1>
    </div>

    <div class="content">
      <div class="greeting">
        ${data.companyName} 様
      </div>

      <p>この度は「とちまち」のウェイトリストにご登録いただき、誠にありがとうございます。</p>

      <div style="text-align: center;">
        <div class="position-badge">
          現在の順位: 第${data.position}位
        </div>
      </div>

      <div class="info-box">
        <h3>登録情報</h3>
        <p>
          会社名: ${data.companyName}<br>
          メールアドレス: ${data.email}<br>
          業種: ${data.categoryName}
        </p>
      </div>

      <div class="info-box">
        <h3>今後の流れ</h3>
        <ol>
          <li>業者登録の枠が空き次第、順番にご案内いたします</li>
          <li>空き通知メールを受信後、7日以内に本登録をお願いいたします</li>
          <li>登録完了後、審査を経てサービス開始となります</li>
        </ol>
      </div>

      <div class="info-box">
        <h3>⚠️ ご注意事項</h3>
        <ul>
          <li>空き通知メールは受信後7日間有効です</li>
          <li>期限内に登録されない場合、次の順位の方に繰り上げとなります</li>
          <li>順位は前後する場合がございます</li>
        </ul>
      </div>

      <p>空き枠のご案内をお待ちください。</p>
    </div>

    <div class="footer">
      <p><strong>とちまち運営事務局</strong></p>
      <p>
        Email: <a href="mailto:support@tochimachi.jp">support@tochimachi.jp</a><br>
        URL: <a href="https://tochimachi.jp">https://tochimachi.jp</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

  return { subject, text, html };
}
