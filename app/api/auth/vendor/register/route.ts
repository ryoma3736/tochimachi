import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, email, password, categoryId, contactPhone, address } = body;

    // バリデーション
    if (!companyName || !email || !password || !categoryId || !contactPhone || !address) {
      return NextResponse.json(
        { message: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingVendor = await prisma.vendor.findUnique({
      where: { email },
    });

    if (existingVendor) {
      return NextResponse.json(
        { message: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    // 300社制限チェック
    const vendorCount = await prisma.vendor.count();
    if (vendorCount >= 300) {
      return NextResponse.json(
        { message: "登録可能な業者数の上限（300社）に達しています" },
        { status: 400 }
      );
    }

    // カテゴリの存在確認
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { message: "選択されたカテゴリが存在しません" },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化
    const passwordHash = await hashPassword(password);

    // 次の表示順序を取得
    const maxDisplayOrder = await prisma.vendor.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });

    const displayOrder = (maxDisplayOrder?.displayOrder || 0) + 1;

    // 業者作成（審査待ち状態）
    const vendor = await prisma.vendor.create({
      data: {
        companyName,
        email,
        passwordHash,
        categoryId,
        displayOrder,
        isActive: true,
        approvedAt: null, // 審査待ち
        profile: {
          create: {
            address,
            contactPhone,
          },
        },
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        message: "登録申請を受け付けました。審査完了後、ログイン可能となります。",
        vendor: {
          id: vendor.id,
          companyName: vendor.companyName,
          email: vendor.email,
          category: vendor.category.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("業者登録エラー:", error);
    return NextResponse.json(
      { message: "登録に失敗しました" },
      { status: 500 }
    );
  }
}
