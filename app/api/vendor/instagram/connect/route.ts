/**
 * Instagram 連携開始 API
 *
 * POST /api/vendor/instagram/connect
 *
 * 業者がInstagramアカウントを連携する際のOAuth認証URL生成
 *
 * 認証フロー:
 * 1. このAPIで認証URLを生成
 * 2. フロントエンドが認証URLにリダイレクト
 * 3. Instagram認証完了後、/api/auth/instagram/callbackにリダイレクト
 * 4. コールバックで認証コードをトークンに交換してDB保存
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getInstagramAuthUrl } from '@/lib/instagram';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/vendor/instagram/connect
 *
 * Instagram OAuth認証URL生成
 *
 * 認証が必要: vendor（業者）のみ
 *
 * Response:
 * - authUrl: Instagram認証URL（stateにvendorIdを含む）
 */
export async function POST(request: NextRequest) {
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

    // 業者の存在確認
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: {
        id: true,
        isActive: true,
        approvedAt: true,
        instagramAccount: {
          select: {
            isActive: true,
            instagramUsername: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (!vendor.isActive || !vendor.approvedAt) {
      return NextResponse.json(
        { error: 'Vendor account is not approved or active' },
        { status: 403 }
      );
    }

    // 既にInstagram連携済みかチェック
    if (vendor.instagramAccount?.isActive) {
      return NextResponse.json(
        {
          message: 'Instagram account already connected',
          username: vendor.instagramAccount.instagramUsername,
        },
        { status: 200 }
      );
    }

    // Instagram OAuth認証URL生成
    const authUrl = getInstagramAuthUrl(vendorId);

    return NextResponse.json({
      authUrl,
      message: 'Redirect to Instagram for authorization',
    });
  } catch (error) {
    console.error('POST /api/vendor/instagram/connect error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to generate Instagram auth URL', details: errorMessage },
      { status: 500 }
    );
  }
}
