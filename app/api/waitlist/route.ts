/**
 * ウェイトリスト登録API
 * POST /api/waitlist - ウェイトリスト登録
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  addToWaitlist,
  canRegisterWaitlist,
  hasAvailableSlot,
} from '@/lib/capacity';
import { sendWaitlistRegisteredEmail } from '@/lib/email/send';

/**
 * バリデーションスキーマ
 */
const waitlistSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  companyName: z
    .string()
    .min(1, '会社名を入力してください')
    .max(100, '会社名は100文字以内で入力してください'),
  categoryId: z.string().uuid('有効な業種IDを選択してください'),
  message: z.string().max(500, 'メッセージは500文字以内で入力してください').optional(),
});

/**
 * POST /api/waitlist
 * ウェイトリスト登録
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const result = waitlistSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, companyName, categoryId, message } = result.data;

    // 枠空き確認（枠が空いている場合はウェイトリストではなく通常登録へ誘導）
    const available = await hasAvailableSlot();
    if (available) {
      return NextResponse.json(
        {
          error: 'Registration available',
          message: '現在、業者登録枠が空いています。直接登録をお願いします。',
          redirectTo: '/vendors/register',
        },
        { status: 400 }
      );
    }

    // 登録可能性チェック
    const canRegister = await canRegisterWaitlist(email);
    if (!canRegister) {
      return NextResponse.json(
        {
          error: 'Already registered',
          message:
            'このメールアドレスは既に登録されているか、ウェイトリストに登録済みです。',
        },
        { status: 400 }
      );
    }

    // ウェイトリスト登録
    const waitlistEntry = await addToWaitlist({
      email,
      companyName,
      categoryId,
      message,
    });

    // 登録完了メール送信
    try {
      await sendWaitlistRegisteredEmail({
        companyName: waitlistEntry.companyName,
        email: waitlistEntry.email,
        categoryName: waitlistEntry.categoryName,
        position: waitlistEntry.position,
      });
    } catch (emailError) {
      console.error('[API] Failed to send waitlist registered email:', emailError);
      // メール送信失敗は登録自体は成功しているので警告ログのみ
    }

    return NextResponse.json(
      {
        success: true,
        waitlist: {
          id: waitlistEntry.id,
          position: waitlistEntry.position,
          categoryName: waitlistEntry.categoryName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Failed to register waitlist:', error);

    return NextResponse.json(
      {
        error: 'Failed to register waitlist',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
