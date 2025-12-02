/**
 * Stripe Integration Library
 * とちまちプロジェクト - 月額12万円自動課金システム
 *
 * 料金体系:
 * - プラットフォーム管理費: 20,000円
 * - Instagram毎日投稿代行: 100,000円
 * - 合計: 120,000円/月
 */

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

// Stripe クライアント初期化
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

// 定数定義
export const SUBSCRIPTION_CONFIG = {
  MONTHLY_FEE: 120000, // 12万円
  CURRENCY: "jpy",
  BILLING_CYCLE: "month" as const,
  PRODUCT_NAME: "とちまち プレミアムプラン",
  PRODUCT_DESCRIPTION:
    "プラットフォーム管理費(2万円) + Instagram毎日投稿代行(10万円)",
} as const;

/**
 * 顧客（Customer）を作成
 */
export async function createStripeCustomer(params: {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  const { email, name, metadata = {} } = params;

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      ...metadata,
      source: "tochimachi",
    },
  });

  return customer;
}

/**
 * サブスクリプションを作成（Checkout Session経由）
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  const { customerId, priceId, successUrl, cancelUrl, metadata = {} } = params;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    subscription_data: {
      metadata,
    },
  });

  return session;
}

/**
 * サブスクリプション情報を取得
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * サブスクリプションをキャンセル
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd = true
): Promise<Stripe.Subscription> {
  if (cancelAtPeriodEnd) {
    // 期間終了時にキャンセル（すぐには止めない）
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    // 即座にキャンセル
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}

/**
 * サブスクリプションを再開
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * 支払い方法を更新
 */
export async function updatePaymentMethod(
  subscriptionId: string,
  paymentMethodId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Customer にデフォルト支払い方法を設定
  await stripe.customers.update(subscription.customer as string, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  // サブスクリプションのデフォルト支払い方法を更新
  return await stripe.subscriptions.update(subscriptionId, {
    default_payment_method: paymentMethodId,
  });
}

/**
 * 請求書一覧を取得
 */
export async function getInvoices(
  customerId: string,
  limit = 12
): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  });

  return invoices.data;
}

/**
 * 支払いインテントを作成（手動決済用）
 */
export async function createPaymentIntent(params: {
  amount: number;
  customerId: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.PaymentIntent> {
  const { amount, customerId, metadata = {} } = params;

  return await stripe.paymentIntents.create({
    amount,
    currency: SUBSCRIPTION_CONFIG.CURRENCY,
    customer: customerId,
    metadata,
  });
}

/**
 * Webhook署名を検証
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

/**
 * 料金（Price）を作成（初回セットアップ用）
 */
export async function createPrice(params: {
  productId: string;
  unitAmount: number;
  currency?: string;
  recurring?: {
    interval: "month" | "year";
    interval_count?: number;
  };
}): Promise<Stripe.Price> {
  const {
    productId,
    unitAmount,
    currency = SUBSCRIPTION_CONFIG.CURRENCY,
    recurring = { interval: "month" },
  } = params;

  return await stripe.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency,
    recurring,
  });
}

/**
 * 商品（Product）を作成（初回セットアップ用）
 */
export async function createProduct(params: {
  name: string;
  description?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Product> {
  const { name, description, metadata = {} } = params;

  return await stripe.products.create({
    name,
    description,
    metadata: {
      ...metadata,
      source: "tochimachi",
    },
  });
}

/**
 * 顧客ポータルセッションを作成（カード更新・請求履歴確認用）
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  const { customerId, returnUrl } = params;

  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * サブスクリプションの次回請求日を取得
 */
export function getNextBillingDate(
  subscription: Stripe.Subscription
): Date | null {
  const periodEnd = (subscription as any).current_period_end;
  if (!periodEnd) return null;
  return new Date(periodEnd * 1000);
}

/**
 * サブスクリプションステータスをDBステータスに変換
 */
export function convertStripeStatusToDBStatus(
  stripeStatus: Stripe.Subscription.Status
): "ACTIVE" | "SUSPENDED" | "CANCELLED" {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "SUSPENDED";
    case "canceled":
    case "incomplete_expired":
      return "CANCELLED";
    default:
      return "SUSPENDED";
  }
}
