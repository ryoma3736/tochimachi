/**
 * Instagram 連携ステータス取得 API
 *
 * GET /api/vendor/instagram/status
 *
 * 業者のInstagram連携状態を取得します。
 *
 * Response:
 * - isConnected: 連携状態（boolean）
 * - username: Instagramユーザー名（連携中のみ）
 * - lastSyncAt: 最終同期日時（連携中のみ）
 * - postsCount: 同期済み投稿数（連携中のみ）
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getInstagramStatus } from '@/lib/instagram';

/**
 * GET /api/vendor/instagram/status
 *
 * Instagram連携ステータス取得
 *
 * 認証が必要: vendor（業者）のみ
 */
export async function GET(request: NextRequest) {
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

    // Instagram連携ステータス取得
    const status = await getInstagramStatus(vendorId);

    return NextResponse.json({
      data: status,
    });
  } catch (error) {
    console.error('GET /api/vendor/instagram/status error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch Instagram status' },
      { status: 500 }
    );
  }
}
