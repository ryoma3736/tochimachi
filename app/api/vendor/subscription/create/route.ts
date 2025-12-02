/**
 * POST /api/vendor/subscription/create
 * サブスクリプション作成（Stripe Checkout Session）
 *
 * 業者登録承認後、月額12万円の自動課金を開始するためのCheckout URLを生成
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createStripeCustomer,
  createCheckoutSession,
  SUBSCRIPTION_CONFIG,
} from "@/lib/stripe";
import {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
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
    const body = (await req.json()) as CreateSubscriptionRequest;
    const { successUrl, cancelUrl } = body;

    // 業者情報を取得
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { subscription: true },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: SUBSCRIPTION_ERROR_MESSAGES.VENDOR_NOT_FOUND },
        { status: 404 }
      );
    }

    // 既にサブスクリプションが存在する場合
    if (vendor.subscription) {
      return NextResponse.json(
        { error: SUBSCRIPTION_ERROR_MESSAGES.ALREADY_EXISTS },
        { status: 400 }
      );
    }

    // 業者が承認されているか確認
    if (!vendor.approvedAt || !vendor.isActive) {
      return NextResponse.json(
        { error: "業者アカウントが承認されていません" },
        { status: 403 }
      );
    }

    // Stripe Price ID（環境変数から取得）
    const stripePriceId = process.env.STRIPE_PRICE_ID;
    if (!stripePriceId) {
      return NextResponse.json(
        { error: "Stripe Price ID が設定されていません" },
        { status: 500 }
      );
    }

    // Stripe Customer を作成（まだ存在しない場合）
    let stripeCustomerId: string | undefined =
      (vendor.subscription as any)?.stripeCustomerId || undefined;

    if (!stripeCustomerId) {
      const customer = await createStripeCustomer({
        email: vendor.email,
        name: vendor.companyName,
        metadata: {
          vendorId: vendor.id,
          displayOrder: vendor.displayOrder.toString(),
        },
      });

      stripeCustomerId = customer.id;
    }

    // Checkout Session を作成
    const checkoutSession = await createCheckoutSession({
      customerId: stripeCustomerId,
      priceId: stripePriceId,
      successUrl,
      cancelUrl,
      metadata: {
        vendorId: vendor.id,
        plan: "STANDARD",
      },
    });

    // サブスクリプションレコードを作成（初期状態）
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await prisma.subscription.create({
      data: {
        vendorId: vendor.id,
        plan: "STANDARD",
        monthlyFee: SUBSCRIPTION_CONFIG.MONTHLY_FEE,
        status: "SUSPENDED", // Checkout完了まで保留
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        nextBillingDate: nextMonth,
        stripeCustomerId,
        stripePriceId,
      },
    });

    const response: CreateSubscriptionResponse = {
      checkoutUrl: checkoutSession.url!,
      sessionId: checkoutSession.id,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("サブスクリプション作成エラー:", error);
    return NextResponse.json(
      {
        error: SUBSCRIPTION_ERROR_MESSAGES.STRIPE_ERROR,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
