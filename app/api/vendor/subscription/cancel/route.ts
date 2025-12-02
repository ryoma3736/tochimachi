/**
 * POST /api/vendor/subscription/cancel
 * サブスクリプション解約
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelSubscription } from "@/lib/stripe";
import {
  CancelSubscriptionRequest,
  SUBSCRIPTION_ERROR_MESSAGES,
} from "@/lib/types/subscription";

export async function POST(req: NextRequest) {
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
    const body = (await req.json()) as CancelSubscriptionRequest;
    const { cancelAtPeriodEnd = true, reason } = body;

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

    if (subscription.status === "CANCELLED") {
      return NextResponse.json(
        { error: "既に解約済みです" },
        { status: 400 }
      );
    }

    if (!subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "Stripe Subscription ID が見つかりません" },
        { status: 400 }
      );
    }

    // Stripeでサブスクリプションをキャンセル
    const cancelledStripeSubscription = await cancelSubscription(
      subscription.stripeSubscriptionId,
      cancelAtPeriodEnd
    );

    // データベースを更新
    const now = new Date();
    const updatedSubscription = await prisma.subscription.update({
      where: { vendorId },
      data: {
        status: cancelAtPeriodEnd ? "ACTIVE" : "CANCELLED",
        cancelledAt: cancelAtPeriodEnd
          ? new Date(cancelledStripeSubscription.cancel_at! * 1000)
          : now,
        updatedAt: now,
      },
    });

    return NextResponse.json(
      {
        message: cancelAtPeriodEnd
          ? "サブスクリプションは期間終了時に解約されます"
          : "サブスクリプションを即座に解約しました",
        subscription: updatedSubscription,
        cancelAt: cancelAtPeriodEnd
          ? new Date(cancelledStripeSubscription.cancel_at! * 1000)
          : now,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("サブスクリプション解約エラー:", error);
    return NextResponse.json(
      {
        error: "サブスクリプションの解約に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
