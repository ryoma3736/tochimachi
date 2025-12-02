/**
 * 問い合わせ詳細API
 * GET /api/inquiries/[id] - 問い合わせ詳細取得
 * PATCH /api/inquiries/[id] - 問い合わせ更新
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendReplyNotificationToCustomer } from '@/lib/email';
import type {
  InquiryDetailResponse,
  UpdateInquiryRequest,
} from '@/lib/types/inquiry';

const prisma = new PrismaClient();

/**
 * GET /api/inquiries/[id]
 * 問い合わせ詳細を取得
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        vendor: {
          select: {
            id: true,
            companyName: true,
            email: true,
            profile: {
              select: {
                contactPhone: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    const response: InquiryDetailResponse = {
      id: inquiry.id,
      vendorId: inquiry.vendorId,
      userId: inquiry.userId,
      status: inquiry.status,
      guestName: inquiry.guestName,
      guestEmail: inquiry.guestEmail,
      guestPhone: inquiry.guestPhone,
      message: inquiry.message,
      vendorReply: inquiry.vendorReply,
      repliedAt: inquiry.repliedAt,
      submittedAt: inquiry.submittedAt,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
      items: inquiry.items.map((item) => ({
        id: item.id,
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        servicePrice: Number(item.servicePrice),
        quantity: item.quantity,
        note: item.note,
        createdAt: item.createdAt,
      })),
      vendor: inquiry.vendor,
      user: inquiry.user || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] GET /api/inquiries/[id] error:', error);
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

/**
 * PATCH /api/inquiries/[id]
 * 問い合わせを更新（業者返信など）
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateInquiryRequest = await req.json();

    // 既存の問い合わせを取得
    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            companyName: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!existingInquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // 問い合わせを更新
    const updatedData: Record<string, unknown> = {};

    if (body.message !== undefined) {
      updatedData.message = body.message;
    }

    if (body.status !== undefined) {
      updatedData.status = body.status;
    }

    if (body.vendorReply !== undefined) {
      updatedData.vendorReply = body.vendorReply;
      updatedData.repliedAt = new Date();
      updatedData.status = 'REPLIED'; // ステータスを自動的にREPLIEDに更新
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: updatedData,
      include: {
        items: true,
        vendor: {
          select: {
            id: true,
            companyName: true,
            email: true,
            profile: {
              select: {
                contactPhone: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // 業者が返信した場合、顧客にメール通知
    if (body.vendorReply && body.vendorReply.trim() !== '') {
      try {
        const customerName = inquiry.user
          ? inquiry.user.name
          : inquiry.guestName || 'お客様';
        const customerEmail = inquiry.user
          ? inquiry.user.email
          : inquiry.guestEmail;

        if (customerEmail) {
          await sendReplyNotificationToCustomer({
            customerName,
            customerEmail,
            vendorName: inquiry.vendor.companyName,
            reply: body.vendorReply,
            originalMessage: inquiry.message,
            inquiryId: inquiry.id,
          });

          console.log(
            `[API] Reply notification sent to customer: ${customerEmail}`
          );
        }
      } catch (emailError) {
        console.error('[API] Email sending failed:', emailError);
        // メール送信失敗でもレスポンスは返す
      }
    }

    const response: InquiryDetailResponse = {
      id: inquiry.id,
      vendorId: inquiry.vendorId,
      userId: inquiry.userId,
      status: inquiry.status,
      guestName: inquiry.guestName,
      guestEmail: inquiry.guestEmail,
      guestPhone: inquiry.guestPhone,
      message: inquiry.message,
      vendorReply: inquiry.vendorReply,
      repliedAt: inquiry.repliedAt,
      submittedAt: inquiry.submittedAt,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
      items: inquiry.items.map((item) => ({
        id: item.id,
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        servicePrice: Number(item.servicePrice),
        quantity: item.quantity,
        note: item.note,
        createdAt: item.createdAt,
      })),
      vendor: inquiry.vendor,
      user: inquiry.user || undefined,
    };

    return NextResponse.json({
      success: true,
      inquiry: response,
      message: 'Inquiry updated successfully',
    });
  } catch (error) {
    console.error('[API] PATCH /api/inquiries/[id] error:', error);
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
