/**
 * 枠状況取得API（管理者用）
 * GET /api/admin/capacity
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDetailedCapacityStatus } from '@/lib/capacity';

/**
 * GET /api/admin/capacity
 * 現在の枠状況（業種別内訳含む）を取得
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 管理者認証チェックを追加
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const status = await getDetailedCapacityStatus();

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error('[API] Failed to get capacity status:', error);

    return NextResponse.json(
      {
        error: 'Failed to get capacity status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
