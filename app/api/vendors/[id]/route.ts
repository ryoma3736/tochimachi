/**
 * Vendor Detail API Routes
 *
 * GET    /api/vendors/[id] - 業者詳細取得
 * PUT    /api/vendors/[id] - 業者情報更新
 * DELETE /api/vendors/[id] - 業者削除（論理削除）
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateVendorSchema, type UpdateVendorInput } from '@/lib/validations/vendor';
import { z } from 'zod';

/**
 * GET /api/vendors/[id]
 * 業者詳細取得
 *
 * Response:
 * - 業者基本情報
 * - カテゴリ情報
 * - プロフィール詳細
 * - サービス一覧
 * - サブスクリプション情報
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        companyName: true,
        categoryId: true,
        isActive: true,
        approvedAt: true,
        createdAt: true,
        updatedAt: true,
        displayOrder: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            iconUrl: true,
          },
        },
        profile: {
          select: {
            id: true,
            description: true,
            logoUrl: true,
            coverImageUrl: true,
            businessHours: true,
            address: true,
            mapUrl: true,
            websiteUrl: true,
            contactPhone: true,
            gallery: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            unit: true,
            duration: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        subscription: {
          select: {
            id: true,
            plan: true,
            monthlyFee: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            nextBillingDate: true,
          },
        },
        _count: {
          select: {
            services: true,
            inquiries: true,
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

    return NextResponse.json({ data: vendor });
  } catch (error) {
    console.error('GET /api/vendors/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/vendors/[id]
 * 業者情報更新
 *
 * Body:
 * - email: メールアドレス（オプション）
 * - companyName: 会社名（オプション）
 * - categoryId: カテゴリID（オプション）
 * - isActive: アクティブ状態（オプション）
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // バリデーション
    const validatedData: UpdateVendorInput = updateVendorSchema.parse(body);

    // 業者存在チェック
    const existingVendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // メールアドレス重複チェック（変更する場合）
    if (validatedData.email && validatedData.email !== existingVendor.email) {
      const emailExists = await prisma.vendor.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    // カテゴリ存在チェック（変更する場合）
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // 更新実行
    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        categoryId: true,
        isActive: true,
        approvedAt: true,
        createdAt: true,
        updatedAt: true,
        displayOrder: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: updatedVendor,
      message: 'Vendor updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('PUT /api/vendors/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/vendors/[id]
 * 業者削除（論理削除）
 *
 * 実装方針:
 * - isActiveをfalseに設定（論理削除）
 * - 完全削除は行わず、データは保持
 * - 300社制限のカウントには含まれない
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 業者存在チェック
    const existingVendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // 論理削除実行（isActiveをfalseに）
    const deletedVendor = await prisma.vendor.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      data: deletedVendor,
      message: 'Vendor deactivated successfully',
    });
  } catch (error) {
    console.error('DELETE /api/vendors/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}
