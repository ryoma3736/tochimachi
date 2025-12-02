/**
 * Individual Service API Routes
 *
 * PUT    /api/vendors/[id]/services/[serviceId] - サービス更新
 * DELETE /api/vendors/[id]/services/[serviceId] - サービス削除
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateServiceSchema, type UpdateServiceInput } from '@/lib/validations/vendor';
import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * PUT /api/vendors/[id]/services/[serviceId]
 * サービス更新
 *
 * Body:
 * - name: サービス名（オプション）
 * - description: 説明（オプション）
 * - price: 料金（オプション）
 * - unit: 単位（オプション）
 * - duration: 所要時間（オプション）
 * - isActive: アクティブ状態（オプション）
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  try {
    const { id, serviceId } = await params;
    const body = await request.json();

    // バリデーション
    const validatedData: UpdateServiceInput = updateServiceSchema.parse(body);

    // 業者存在チェック
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // サービス存在チェック（該当業者のものか確認）
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    if (existingService.vendorId !== id) {
      return NextResponse.json(
        { error: 'Service does not belong to this vendor' },
        { status: 403 }
      );
    }

    // データ変換（priceがある場合はDecimal型に）
    const updateData: any = { ...validatedData };
    if (validatedData.price !== undefined) {
      updateData.price = new Decimal(validatedData.price);
    }

    // サービス更新
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        vendorId: true,
        name: true,
        description: true,
        price: true,
        unit: true,
        duration: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Decimalを数値に変換
    const serviceWithNumericPrice = {
      ...updatedService,
      price: Number(updatedService.price),
    };

    return NextResponse.json({
      data: serviceWithNumericPrice,
      message: 'Service updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('PUT /api/vendors/[id]/services/[serviceId] error:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/vendors/[id]/services/[serviceId]
 * サービス削除
 *
 * 実装方針:
 * - 論理削除（isActiveをfalseに設定）
 * - 既存の問い合わせ明細との整合性を保持
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  try {
    const { id, serviceId } = await params;

    // 業者存在チェック
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // サービス存在チェック（該当業者のものか確認）
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    if (existingService.vendorId !== id) {
      return NextResponse.json(
        { error: 'Service does not belong to this vendor' },
        { status: 403 }
      );
    }

    // 論理削除実行（isActiveをfalseに）
    const deletedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        vendorId: true,
        name: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      data: deletedService,
      message: 'Service deactivated successfully',
    });
  } catch (error) {
    console.error('DELETE /api/vendors/[id]/services/[serviceId] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
