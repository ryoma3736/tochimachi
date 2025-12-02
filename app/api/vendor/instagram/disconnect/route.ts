/**
 * Instagram 連携解除 API
 *
 * DELETE /api/vendor/instagram/disconnect
 *
 * 業者のInstagramアカウント連携を解除します。
 *
 * 処理内容:
 * - アクセストークンを削除
 * - isActiveをfalseに変更
 * - 同期済み投稿データは保持（必要に応じて削除可能）
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { disconnectInstagram, InstagramAPIError } from '@/lib/instagram';

/**
 * DELETE /api/vendor/instagram/disconnect
 *
 * Instagram連携解除
 *
 * 認証が必要: vendor（業者）のみ
 *
 * Response:
 * - message: 解除成功メッセージ
 */
export async function DELETE(request: NextRequest) {
  try {
    // セッション認証チェック
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'vendor') {
      return NextResponse.json(
        { error: 'Unauthorized. Vendor authentication required.' },
        { status: 401 }
      );
    }

    const vendorId = session.user.id;

    // Instagram連携解除処理
    await disconnectInstagram(vendorId);

    console.log('✅ Instagram disconnected successfully:', { vendorId });

    return NextResponse.json({
      message: 'Instagram account disconnected successfully',
    });
  } catch (error) {
    console.error('DELETE /api/vendor/instagram/disconnect error:', error);

    if (error instanceof InstagramAPIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Failed to disconnect Instagram account' },
      { status: 500 }
    );
  }
}
