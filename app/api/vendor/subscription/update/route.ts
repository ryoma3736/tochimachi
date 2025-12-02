/**
 * PUT /api/vendor/subscription/update
 * サブスクリプション更新（カード情報更新）
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePaymentMethod } from "@/lib/stripe";
import {
  UpdateSubscriptionRequest,
  SUBSCRIPTION_ERROR_MESSAGES,
} from "@/lib/types/subscription";

export async function PUT(req: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "vendor") {
      return NextResponse.json(
        { error: SUBSCRIPTION_ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const vendorId = session.user.id;

    // リクエストボディ解析
    const body = (await req.json()) as UpdateSubscriptionRequest;
    const { paymentMethodId } = body;

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "paymentMethodId is required" },
        { status: 400 }
      );
    }

    // サブスクリプション情報を取得
    const subscription = await prisma.subscription.findUnique({
      where: { vendorId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: SUBSCRIPTION_ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    if (!subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "Stripe Subscription ID が見つかりません" },
        { status: 400 }
      );
    }

    // Stripeで支払い方法を更新
    const updatedStripeSubscription = await updatePaymentMethod(
      subscription.stripeSubscriptionId,
      paymentMethodId
    );

    // データベースを更新
    const updatedSubscription = await prisma.subscription.update({
      where: { vendorId },
      data: {
        paymentMethodId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "支払い方法を更新しました",
        subscription: updatedSubscription,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("サブスクリプション更新エラー:", error);
    return NextResponse.json(
      {
        error: "支払い方法の更新に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
