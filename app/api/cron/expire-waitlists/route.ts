/**
 * Cron Job: 期限切れウェイトリスト処理
 * POST /api/cron/expire-waitlists
 *
 * 毎日午前2時に実行（Vercel Cron Jobsまたは外部Cron）
 */

import { NextRequest, NextResponse } from 'next/server';
import { expireNotifiedWaitlists } from '@/lib/capacity';

/**
 * POST /api/cron/expire-waitlists
 * 期限切れウェイトリストを EXPIRED ステータスに変更
 */
export async function POST(request: NextRequest) {
  try {
    // Cron Secret検証（セキュリティ）
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Cron] Starting expire-waitlists job...');

    // 期限切れ処理実行
    const expiredCount = await expireNotifiedWaitlists();

    console.log(`[Cron] Expired ${expiredCount} waitlist entries`);

    return NextResponse.json(
      {
        success: true,
        expiredCount,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Cron] Failed to expire waitlists:', error);

    return NextResponse.json(
      {
        error: 'Failed to expire waitlists',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json(
    {
      message: 'Expire waitlists cron endpoint',
      usage: 'POST with Authorization: Bearer <CRON_SECRET>',
    },
    { status: 200 }
  );
}
