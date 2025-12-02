/**
 * 業者向け問い合わせ一覧API
 * GET /api/vendor/inquiries - 業者が受け取った問い合わせ一覧
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, InquiryStatus } from '@prisma/client';
import type {
  InquiryListResponse,
  InquiryListItem,
  InquiryStats,
} from '@/lib/types/inquiry';

const prisma = new PrismaClient();

/**
 * GET /api/vendor/inquiries
 * 業者が受け取った問い合わせ一覧を取得
 *
 * クエリパラメータ:
 * - vendorId: 業者ID（必須）
 * - status: フィルタ（DRAFT, SUBMITTED, REPLIED, CLOSED）
 * - page: ページ番号（デフォルト: 1）
 * - pageSize: ページサイズ（デフォルト: 20）
 * - stats: 統計情報を含めるか（true/false）
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // クエリパラメータ取得
    const vendorId = searchParams.get('vendorId');
    const statusFilter = searchParams.get('status') as InquiryStatus | null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const includeStats = searchParams.get('stats') === 'true';

    // バリデーション
    if (!vendorId) {
      return NextResponse.json(
        { error: 'vendorId is required' },
        { status: 400 }
      );
    }

    // 業者の存在確認
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // 検索条件構築
    const where: Record<string, unknown> = {
      vendorId,
    };

    if (statusFilter) {
      where.status = statusFilter;
    }

    // 総件数取得
    const total = await prisma.inquiry.count({ where });

    // ページネーション計算
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    // 問い合わせ一覧取得
    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [{ submittedAt: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: pageSize,
    });

    // レスポンス構築
    const inquiryList: InquiryListItem[] = inquiries.map((inquiry) => ({
      id: inquiry.id,
      vendorId: inquiry.vendorId,
      status: inquiry.status,
      customerName: inquiry.user ? inquiry.user.name : inquiry.guestName || '',
      customerEmail: inquiry.user
        ? inquiry.user.email
        : inquiry.guestEmail || null,
      message: inquiry.message,
      submittedAt: inquiry.submittedAt,
      createdAt: inquiry.createdAt,
      itemsCount: inquiry.items.length,
    }));

    const response: InquiryListResponse = {
      inquiries: inquiryList,
      total,
      page,
      pageSize,
      totalPages,
    };

    // 統計情報を含める場合
    let stats: InquiryStats | undefined;
    if (includeStats) {
      const [draftCount, submittedCount, repliedCount, closedCount] =
        await Promise.all([
          prisma.inquiry.count({
            where: { vendorId, status: InquiryStatus.DRAFT },
          }),
          prisma.inquiry.count({
            where: { vendorId, status: InquiryStatus.SUBMITTED },
          }),
          prisma.inquiry.count({
            where: { vendorId, status: InquiryStatus.REPLIED },
          }),
          prisma.inquiry.count({
            where: { vendorId, status: InquiryStatus.CLOSED },
          }),
        ]);

      stats = {
        total,
        draft: draftCount,
        submitted: submittedCount,
        replied: repliedCount,
        closed: closedCount,
      };
    }

    return NextResponse.json({
      ...response,
      ...(stats && { stats }),
    });
  } catch (error) {
    console.error('[API] GET /api/vendor/inquiries error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
