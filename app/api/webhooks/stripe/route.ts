/**
 * POST /api/webhooks/stripe
 * Stripe Webhook エンドポイント
 *
 * 処理イベント:
 * - invoice.payment_succeeded: 支払い成功
 * - invoice.payment_failed: 支払い失敗
 * - customer.subscription.created: サブスクリプション作成
 * - customer.subscription.updated: サブスクリプション更新
 * - customer.subscription.deleted: サブスクリプション削除
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  verifyWebhookSignature,
  convertStripeStatusToDBStatus,
  getNextBillingDate,
} from "@/lib/stripe";
import Stripe from "stripe";
import type { PaymentHistoryEntry } from "@/lib/types/subscription";

export async function POST(req: NextRequest) {
  try {
    // Webhook署名検証
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Stripe イベントを検証
    const event = verifyWebhookSignature(body, signature, webhookSecret);

    console.log(`Webhook received: ${event.type}`);

    // イベントタイプごとに処理
    switch (event.type) {
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook処理エラー:", error);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}

/**
 * Checkout Session 完了処理
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const vendorId = session.metadata?.vendorId;
  if (!vendorId) {
    console.error("vendorId not found in session metadata");
    return;
  }

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  await prisma.subscription.update({
    where: { vendorId },
    data: {
      status: "ACTIVE",
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId,
    },
  });

  console.log(`Checkout completed for vendor ${vendorId}`);
}

/**
 * 支払い成功処理
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === 'string'
    ? (invoice as any).subscription
    : (invoice as any).subscription?.id;
  if (!subscriptionId) return;

  // サブスクリプションを検索
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  // 支払い履歴を追加
  const paymentHistory = (subscription.paymentHistory as PaymentHistoryEntry[] | null) || [];
  const newEntry: PaymentHistoryEntry = {
    date: new Date(invoice.created * 1000).toISOString(),
    amount: invoice.amount_paid,
    status: "succeeded",
    invoiceId: invoice.id,
    receiptUrl: invoice.hosted_invoice_url || undefined,
  };

  paymentHistory.push(newEntry);

  // 次回請求日を計算
  const nextBillingDate = invoice.period_end
    ? new Date(invoice.period_end * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // データベースを更新
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: "ACTIVE",
      lastPaymentStatus: "succeeded",
      lastPaymentAt: new Date(invoice.created * 1000),
      failedPaymentCount: 0, // リセット
      nextBillingDate,
      currentPeriodStart: new Date(invoice.period_start! * 1000),
      currentPeriodEnd: new Date(invoice.period_end! * 1000),
      paymentHistory: paymentHistory as any,
      updatedAt: new Date(),
    },
  });

  console.log(`Payment succeeded for subscription ${subscriptionId}`);
}

/**
 * 支払い失敗処理
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === 'string'
    ? (invoice as any).subscription
    : (invoice as any).subscription?.id;
  if (!subscriptionId) return;

  // サブスクリプションを検索
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  // 支払い履歴を追加
  const paymentHistory = (subscription.paymentHistory as PaymentHistoryEntry[] | null) || [];
  const newEntry: PaymentHistoryEntry = {
    date: new Date(invoice.created * 1000).toISOString(),
    amount: invoice.amount_due,
    status: "failed",
    invoiceId: invoice.id,
  };

  paymentHistory.push(newEntry);

  const failedCount = subscription.failedPaymentCount + 1;

  // データベースを更新
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: failedCount >= 3 ? "SUSPENDED" : "ACTIVE",
      lastPaymentStatus: "failed",
      lastPaymentAt: new Date(invoice.created * 1000),
      failedPaymentCount: failedCount,
      paymentHistory: paymentHistory as any,
      updatedAt: new Date(),
    },
  });

  console.log(
    `Payment failed for subscription ${subscriptionId} (attempt ${failedCount})`
  );

  // TODO: 業者に支払い失敗通知メールを送信
}

/**
 * サブスクリプション更新処理
 */
async function handleSubscriptionUpdated(
  stripeSubscription: Stripe.Subscription
) {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSubscription.id },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${stripeSubscription.id}`);
    return;
  }

  const status = convertStripeStatusToDBStatus(stripeSubscription.status);
  const nextBillingDate = getNextBillingDate(stripeSubscription);

  await prisma.subscription.update({
    where: { stripeSubscriptionId: stripeSubscription.id },
    data: {
      status,
      currentPeriodStart: new Date(
        (stripeSubscription as any).current_period_start * 1000
      ),
      currentPeriodEnd: new Date(
        (stripeSubscription as any).current_period_end * 1000
      ),
      nextBillingDate: nextBillingDate || new Date(),
      paymentMethodId:
        (typeof stripeSubscription.default_payment_method === 'string'
          ? stripeSubscription.default_payment_method
          : (stripeSubscription.default_payment_method as any)?.id) || null,
      updatedAt: new Date(),
    },
  });

  console.log(`Subscription updated: ${stripeSubscription.id}`);
}

/**
 * サブスクリプション削除処理
 */
async function handleSubscriptionDeleted(
  stripeSubscription: Stripe.Subscription
) {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSubscription.id },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${stripeSubscription.id}`);
    return;
  }

  await prisma.subscription.update({
    where: { stripeSubscriptionId: stripeSubscription.id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Subscription cancelled: ${stripeSubscription.id}`);
}
