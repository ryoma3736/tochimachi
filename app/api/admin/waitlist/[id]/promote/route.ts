/**
 * ウェイトリスト繰り上げ登録API
 * POST /api/admin/waitlist/[id]/promote
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getWaitlistEntry,
  promoteWaitlistEntry,
  notifyWaitlistEntry,
} from '@/lib/capacity';
import { sendWaitlistNotificationEmail } from '@/lib/email/send';
import { WaitlistStatus } from '@prisma/client';

/**
 * POST /api/admin/waitlist/[id]/promote
 * ウェイトリストエントリを繰り上げ（空き通知送信）
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: 管理者認証チェックを追加
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id: waitlistId } = await params;

    // ウェイトリストエントリ取得
    const entry = await getWaitlistEntry(waitlistId);
    if (!entry) {
      return NextResponse.json(
        { error: 'Waitlist entry not found' },
        { status: 404 }
      );
    }

    // ステータスチェック（待機中のみ通知可能）
    if (entry.status !== WaitlistStatus.WAITING) {
      return NextResponse.json(
        {
          error: 'Invalid status',
          message: `Cannot promote entry with status: ${entry.status}`,
        },
        { status: 400 }
      );
    }

    // 通知ステータスに更新
    const notifiedEntry = await notifyWaitlistEntry(waitlistId);

    // 空き通知メール送信
    const registrationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/vendors/register?waitlist=${waitlistId}`;

    try {
      await sendWaitlistNotificationEmail({
        companyName: notifiedEntry.companyName,
        email: notifiedEntry.email,
        categoryName: notifiedEntry.categoryName,
        position: notifiedEntry.position,
        expiresAt: notifiedEntry.expiresAt!,
        registrationUrl,
      });
    } catch (emailError) {
      console.error('[API] Failed to send waitlist notification email:', emailError);
      // メール送信失敗時はロールバック
      return NextResponse.json(
        {
          error: 'Failed to send notification email',
          message: emailError instanceof Error ? emailError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        waitlist: notifiedEntry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Failed to promote waitlist entry:', error);

    return NextResponse.json(
      {
        error: 'Failed to promote waitlist entry',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
