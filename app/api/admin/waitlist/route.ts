/**
 * 管理者用ウェイトリスト管理API
 * GET /api/admin/waitlist - ウェイトリスト一覧取得
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllWaitlists, expireNotifiedWaitlists } from '@/lib/capacity';
import { WaitlistStatus } from '@prisma/client';

/**
 * GET /api/admin/waitlist
 * ウェイトリスト一覧取得（フィルタリング可能）
 *
 * クエリパラメータ:
 * - status: WaitlistStatus (WAITING, NOTIFIED, PROMOTED, EXPIRED, CANCELLED)
 * - categoryId: string (UUID)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 管理者認証チェックを追加
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as WaitlistStatus | null;
    const categoryId = searchParams.get('categoryId');

    // 期限切れ処理を実行
    const expiredCount = await expireNotifiedWaitlists();
    if (expiredCount > 0) {
      console.log(`[API] Expired ${expiredCount} waitlist entries`);
    }

    // ウェイトリスト取得
    const waitlists = await getAllWaitlists({
      ...(status && { status }),
      ...(categoryId && { categoryId }),
    });

    return NextResponse.json(
      {
        waitlists,
        count: waitlists.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Failed to get waitlists:', error);

    return NextResponse.json(
      {
        error: 'Failed to get waitlists',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
