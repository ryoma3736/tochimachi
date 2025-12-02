/**
 * 問い合わせAPI
 *
 * POST /api/inquiry
 * - カートの業者全員にメール一斉送信
 */

import { NextRequest, NextResponse } from 'next/server';
import type { InquiryFormData } from '@/app/inquiry/page';
import type { CartItem } from '@/lib/stores/cart-store';

interface InquiryRequestBody {
  formData: InquiryFormData;
  cartItems: CartItem[];
}

export async function POST(request: NextRequest) {
  try {
    const body: InquiryRequestBody = await request.json();
    const { formData, cartItems } = body;

    // バリデーション
    if (!formData || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // メール送信処理（実装時はメールサービス統合）
    // 例: SendGrid, Resend, Amazon SES など
    const emailResults = await sendInquiryEmails(formData, cartItems);

    // データベース保存（実装時はPrisma統合）
    // await saveInquiryToDatabase(formData, cartItems);

    return NextResponse.json({
      success: true,
      message: 'お問い合わせを送信しました',
      sentCount: emailResults.length,
    });
  } catch (error) {
    console.error('Error processing inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * メール一斉送信処理
 * TODO: 実際のメールサービスと統合
 */
async function sendInquiryEmails(
  formData: InquiryFormData,
  cartItems: CartItem[]
): Promise<string[]> {
  const results: string[] = [];

  // お客様への確認メール
  const customerEmail = await sendCustomerConfirmationEmail(formData);
  results.push(customerEmail);

  // 各業者へのメール
  for (const item of cartItems) {
    const vendorEmail = await sendVendorInquiryEmail(formData, item);
    results.push(vendorEmail);
  }

  return results;
}

/**
 * お客様への確認メール送信
 */
async function sendCustomerConfirmationEmail(
  formData: InquiryFormData
): Promise<string> {
  // TODO: 実際のメール送信実装
  console.log('[Email] Customer confirmation:', formData.email);

  // メールテンプレート例
  const subject = '【とちまち】お問い合わせを受け付けました';
  const body = `
${formData.customerName} 様

この度は「とちまち」をご利用いただき、誠にありがとうございます。
お問い合わせを受け付けました。

選択した業者から個別に連絡がありますので、しばらくお待ちください。
通常1〜3営業日以内にご連絡があります。

【お問い合わせ内容】
お名前: ${formData.customerName}
メールアドレス: ${formData.email}
電話番号: ${formData.phone}
希望連絡方法: ${formData.contactMethod}

ご不明な点がございましたら、お気軽にお問い合わせください。

━━━━━━━━━━━━━━━━━━━━━━
とちまち - 栃木県ポータルサイト
Email: support@tochimachi.com
━━━━━━━━━━━━━━━━━━━━━━
`;

  // 実装例:
  // await sendEmail({
  //   to: formData.email,
  //   subject,
  //   text: body,
  // });

  return formData.email;
}

/**
 * 業者への問い合わせメール送信
 */
async function sendVendorInquiryEmail(
  formData: InquiryFormData,
  cartItem: CartItem
): Promise<string> {
  // TODO: 実際のメール送信実装
  console.log('[Email] Vendor inquiry:', cartItem.vendorName);

  // メールテンプレート例
  const subject = '【とちまち】新規お問い合わせ';
  const body = `
${cartItem.vendorName} 様

「とちまち」経由で新しいお問い合わせがありました。

【お客様情報】
お名前: ${formData.customerName}（${formData.customerNameKana}）
メールアドレス: ${formData.email}
電話番号: ${formData.phone}
住所: 〒${formData.postalCode} ${formData.prefecture}${formData.city}${formData.address}

【希望連絡方法】
${formData.contactMethod === 'email' ? 'メール' : formData.contactMethod === 'phone' ? '電話' : 'どちらでも可'}

【希望日時】
${formData.preferredDate ? `日付: ${formData.preferredDate}` : '指定なし'}
${formData.preferredTime ? `時間帯: ${formData.preferredTime}` : ''}

【選択サービス】
${cartItem.serviceName}
${cartItem.services.join('、')}

【ご要望】
${formData.message || 'なし'}

━━━━━━━━━━━━━━━━━━━━━━
できるだけ早めにお客様へご連絡をお願いします。
━━━━━━━━━━━━━━━━━━━━━━
`;

  // 実装例:
  // const vendorEmail = await getVendorEmail(cartItem.vendorId);
  // await sendEmail({
  //   to: vendorEmail,
  //   subject,
  //   text: body,
  // });

  return cartItem.vendorId;
}
