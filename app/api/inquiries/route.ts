/**
 * 問い合わせ作成API
 * POST /api/inquiries - 問い合わせを作成し、メール一斉送信
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, InquiryStatus } from '@prisma/client';
import {
  sendInquiryNotificationToVendor,
  sendInquiryConfirmationToCustomer,
} from '@/lib/email';
import type { CreateInquiryRequest } from '@/lib/types/inquiry';

const prisma = new PrismaClient();

/**
 * POST /api/inquiries
 * 問い合わせを作成し、業者と顧客にメール送信
 */
export async function POST(req: NextRequest) {
  try {
    const body: CreateInquiryRequest = await req.json();

    // バリデーション
    if (!body.vendorId || !body.message) {
      return NextResponse.json(
        { error: 'vendorId and message are required' },
        { status: 400 }
      );
    }

    if (!body.userId && (!body.guestName || !body.guestEmail)) {
      return NextResponse.json(
        {
          error: 'userId or (guestName and guestEmail) are required',
        },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }

    // 業者情報を取得
    const vendor = await prisma.vendor.findUnique({
      where: { id: body.vendorId },
      include: {
        profile: {
          select: {
            contactPhone: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // ユーザー情報を取得（ログインユーザーの場合）
    let user = null;
    if (body.userId) {
      user = await prisma.user.findUnique({
        where: { id: body.userId },
      });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    // 問い合わせを作成（トランザクション）
    const inquiry = await prisma.$transaction(async (tx) => {
      // Inquiryレコード作成
      const newInquiry = await tx.inquiry.create({
        data: {
          vendorId: body.vendorId,
          userId: body.userId || null,
          guestName: body.guestName || null,
          guestEmail: body.guestEmail || null,
          guestPhone: body.guestPhone || null,
          message: body.message,
          status: InquiryStatus.SUBMITTED,
          submittedAt: new Date(),
        },
      });

      // InquiryItemレコード作成
      await tx.inquiryItem.createMany({
        data: body.items.map((item) => ({
          inquiryId: newInquiry.id,
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          servicePrice: item.servicePrice,
          quantity: item.quantity,
          note: item.note || null,
          userId: body.userId || null,
        })),
      });

      return newInquiry;
    });

    // 顧客情報を構築
    const customerName = user ? user.name : body.guestName!;
    const customerEmail = user ? user.email : body.guestEmail!;
    const customerPhone = user ? user.phone : body.guestPhone;

    // メール送信
    try {
      // 業者向けメール送信
      await sendInquiryNotificationToVendor({
        vendorName: vendor.companyName,
        vendorEmail: vendor.email,
        customerName,
        customerPhone: customerPhone || undefined,
        customerEmail: customerEmail || undefined,
        message: body.message,
        services: body.items.map((item) => ({
          name: item.serviceName,
          price: item.servicePrice,
          quantity: item.quantity,
        })),
        inquiryId: inquiry.id,
      });

      // 顧客向けメール送信
      await sendInquiryConfirmationToCustomer({
        customerName,
        customerEmail,
        vendorName: vendor.companyName,
        message: body.message,
        services: body.items.map((item) => ({
          name: item.serviceName,
          price: item.servicePrice,
          quantity: item.quantity,
        })),
        inquiryId: inquiry.id,
      });

      console.log(`[API] Inquiry created and emails sent: ${inquiry.id}`);
    } catch (emailError) {
      console.error('[API] Email sending failed:', emailError);
      // メール送信失敗でもレスポンスは返す（問い合わせは作成済み）
    }

    // 作成された問い合わせを詳細付きで返す
    const inquiryDetail = await prisma.inquiry.findUnique({
      where: { id: inquiry.id },
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

    return NextResponse.json(
      {
        success: true,
        inquiry: inquiryDetail,
        message: 'Inquiry created and emails sent successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] POST /api/inquiries error:', error);
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
