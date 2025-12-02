/**
 * Vendor API Routes
 *
 * GET  /api/vendors - 業者一覧取得（フィルター、ページネーション対応）
 * POST /api/vendors - 業者新規登録（300社制限チェック）
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma, canRegisterNewVendor, getNextDisplayOrder } from '@/lib/prisma';
import {
  createVendorSchema,
  getVendorsQuerySchema,
  type CreateVendorInput,
} from '@/lib/validations/vendor';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

/**
 * GET /api/vendors
 * 業者一覧取得
 *
 * Query Parameters:
 * - page: ページ番号（デフォルト: 1）
 * - limit: 1ページあたりの件数（デフォルト: 20, 最大: 100）
 * - categoryId: カテゴリIDでフィルタ
 * - isActive: アクティブ状態でフィルタ（true/false）
 * - search: 会社名での検索
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // クエリパラメータのバリデーション
    const query = getVendorsQuerySchema.parse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      isActive: searchParams.get('isActive') || undefined,
      search: searchParams.get('search') || undefined,
    });

    const { page, limit, categoryId, isActive, search } = query;
    const skip = (page - 1) * limit;

    // フィルター条件構築
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.companyName = {
        contains: search,
        mode: 'insensitive', // 大文字小文字を区別しない
      };
    }

    // 総件数取得
    const total = await prisma.vendor.count({ where });

    // 業者一覧取得
    const vendors = await prisma.vendor.findMany({
      where,
      skip,
      take: limit,
      orderBy: { displayOrder: 'asc' },
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
        profile: {
          select: {
            logoUrl: true,
            description: true,
            address: true,
            contactPhone: true,
          },
        },
        _count: {
          select: {
            services: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: vendors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('GET /api/vendors error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vendors
 * 業者新規登録
 *
 * Body:
 * - email: メールアドレス
 * - password: パスワード（8文字以上、大小文字・数字含む）
 * - companyName: 会社名
 * - categoryId: カテゴリID
 *
 * 制約:
 * - 300社上限チェック
 * - displayOrder自動割り当て（1-300）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData: CreateVendorInput = createVendorSchema.parse(body);

    // 300社制限チェック
    const canRegister = await canRegisterNewVendor();
    if (!canRegister) {
      return NextResponse.json(
        { error: '業者登録上限（300社）に達しています' },
        { status: 403 }
      );
    }

    // メールアドレス重複チェック
    const existingVendor = await prisma.vendor.findUnique({
      where: { email: validatedData.email },
    });

    if (existingVendor) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // カテゴリ存在チェック
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 次のdisplayOrder取得
    const displayOrder = await getNextDisplayOrder();
    if (displayOrder === null) {
      return NextResponse.json(
        { error: '業者登録枠が満杯です' },
        { status: 403 }
      );
    }

    // パスワードハッシュ化
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // 業者作成
    const vendor = await prisma.vendor.create({
      data: {
        email: validatedData.email,
        passwordHash,
        companyName: validatedData.companyName,
        categoryId: validatedData.categoryId,
        displayOrder,
        isActive: false, // 初期状態は未承認
        approvedAt: null,
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        categoryId: true,
        isActive: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: vendor, message: 'Vendor created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('POST /api/vendors error:', error);
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
}
