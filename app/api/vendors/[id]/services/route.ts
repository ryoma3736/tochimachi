/**
 * Vendor Services API Routes
 *
 * GET  /api/vendors/[id]/services - サービス一覧取得
 * POST /api/vendors/[id]/services - サービス追加
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServiceSchema, type CreateServiceInput } from '@/lib/validations/vendor';
import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * GET /api/vendors/[id]/services
 * 指定業者のサービス一覧取得
 *
 * Query Parameters:
 * - isActive: アクティブ状態でフィルタ（true/false）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const isActiveParam = searchParams.get('isActive');

    // 業者存在チェック
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      select: { id: true, companyName: true },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // フィルター条件構築
    const where: any = { vendorId: id };

    if (isActiveParam !== null) {
      where.isActive = isActiveParam === 'true';
    }

    // サービス一覧取得
    const services = await prisma.service.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
    const servicesWithNumericPrice = services.map(service => ({
      ...service,
      price: Number(service.price),
    }));

    return NextResponse.json({
      data: servicesWithNumericPrice,
      vendor: {
        id: vendor.id,
        companyName: vendor.companyName,
      },
    });
  } catch (error) {
    console.error('GET /api/vendors/[id]/services error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vendors/[id]/services
 * サービス追加
 *
 * Body:
 * - name: サービス名
 * - description: 説明（オプション）
 * - price: 料金（正の数値）
 * - unit: 単位（例: "1時間", "1回"）
 * - duration: 所要時間（分、オプション）
 * - isActive: アクティブ状態（デフォルト: true）
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // バリデーション
    const validatedData: CreateServiceInput = createServiceSchema.parse(body);

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

    // サービス作成
    const service = await prisma.service.create({
      data: {
        vendorId: id,
        name: validatedData.name,
        description: validatedData.description,
        price: new Decimal(validatedData.price),
        unit: validatedData.unit,
        duration: validatedData.duration,
        isActive: validatedData.isActive ?? true,
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
      ...service,
      price: Number(service.price),
    };

    return NextResponse.json(
      { data: serviceWithNumericPrice, message: 'Service created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('POST /api/vendors/[id]/services error:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
