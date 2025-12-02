/**
 * Instagram OAuth コールバック API
 *
 * GET /api/auth/instagram/callback
 *
 * Instagram OAuth認証完了後のコールバック処理
 *
 * フロー:
 * 1. Instagram認証完了後、codeとstateパラメータを受け取る
 * 2. stateからvendorIdを取得（CSRF対策）
 * 3. codeをアクセストークンに交換
 * 4. 短期トークンを長期トークンに交換
 * 5. トークンを暗号化してDB保存
 * 6. フロントエンドにリダイレクト（成功/失敗）
 */

import { NextRequest, NextResponse } from 'next/server';
import { completeInstagramAuth, InstagramAPIError } from '@/lib/instagram';

/**
 * GET /api/auth/instagram/callback
 *
 * Instagram OAuth認証コールバック
 *
 * Query Parameters:
 * - code: Instagram認証コード
 * - state: vendorId（CSRF対策）
 * - error: エラーコード（認証拒否時）
 * - error_reason: エラー理由
 * - error_description: エラー詳細
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // エラーレスポンスチェック（ユーザーが認証を拒否した場合など）
    const error = searchParams.get('error');
    if (error) {
      const errorReason = searchParams.get('error_reason') || 'unknown';
      const errorDescription = searchParams.get('error_description') || 'User denied access';

      console.error('Instagram OAuth error:', {
        error,
        errorReason,
        errorDescription,
      });

      // フロントエンドにエラーを通知してリダイレクト
      const redirectUrl = new URL('/vendor/settings/instagram', request.nextUrl.origin);
      redirectUrl.searchParams.set('status', 'error');
      redirectUrl.searchParams.set('message', errorDescription);

      return NextResponse.redirect(redirectUrl);
    }

    // 必須パラメータ取得
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // vendorId

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters: code or state' },
        { status: 400 }
      );
    }

    const vendorId = state;

    // Instagram認証完了処理（トークン交換 & DB保存）
    const instagramAccount = await completeInstagramAuth(vendorId, code);

    console.log('✅ Instagram connected successfully:', {
      vendorId,
      username: instagramAccount.instagramUsername,
    });

    // フロントエンドにリダイレクト（成功）
    const redirectUrl = new URL('/vendor/settings/instagram', request.nextUrl.origin);
    redirectUrl.searchParams.set('status', 'success');
    redirectUrl.searchParams.set('username', instagramAccount.instagramUsername);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('GET /api/auth/instagram/callback error:', error);

    let errorMessage = 'Failed to complete Instagram authentication';
    let statusCode = 500;

    if (error instanceof InstagramAPIError) {
      errorMessage = error.message;
      statusCode = error.statusCode;
    }

    // フロントエンドにエラーを通知してリダイレクト
    const redirectUrl = new URL('/vendor/settings/instagram', request.nextUrl.origin);
    redirectUrl.searchParams.set('status', 'error');
    redirectUrl.searchParams.set('message', errorMessage);

    return NextResponse.redirect(redirectUrl);
  }
}
