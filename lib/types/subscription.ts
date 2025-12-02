/**
 * Subscription Type Definitions
 * サブスクリプション関連の型定義
 */

import { Subscription, SubscriptionStatus, SubscriptionPlan } from "@prisma/client";

/**
 * サブスクリプション作成リクエスト
 */
export interface CreateSubscriptionRequest {
  vendorId: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * サブスクリプション作成レスポンス
 */
export interface CreateSubscriptionResponse {
  checkoutUrl: string;
  sessionId: string;
}

/**
 * サブスクリプション詳細情報
 */
export interface SubscriptionDetails extends Subscription {
  vendor?: {
    id: string;
    email: string;
    companyName: string;
  };
  upcomingInvoice?: {
    amount: number;
    dueDate: Date;
  };
  paymentMethod?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

/**
 * サブスクリプション更新リクエスト
 */
export interface UpdateSubscriptionRequest {
  paymentMethodId?: string;
}

/**
 * サブスクリプションキャンセルリクエスト
 */
export interface CancelSubscriptionRequest {
  cancelAtPeriodEnd?: boolean; // true: 期間終了時にキャンセル, false: 即座にキャンセル
  reason?: string;
}

/**
 * Webhook イベント処理結果
 */
export interface WebhookProcessResult {
  success: boolean;
  eventType: string;
  vendorId?: string;
  message: string;
  error?: string;
}

/**
 * 支払い履歴エントリ
 */
export interface PaymentHistoryEntry {
  date: string;
  amount: number;
  status: "succeeded" | "failed" | "pending";
  invoiceId?: string;
  receiptUrl?: string;
}

/**
 * サブスクリプションサマリー（管理者用）
 */
export interface SubscriptionSummary {
  totalActiveSubscriptions: number;
  totalSuspendedSubscriptions: number;
  totalCancelledSubscriptions: number;
  monthlyRecurringRevenue: number; // MRR
  averageSubscriptionLength: number; // 平均サブスク期間（日数）
  churnRate: number; // 解約率
}

/**
 * Stripe Webhook イベントタイプ
 */
export type StripeWebhookEvent =
  | "invoice.payment_succeeded"
  | "invoice.payment_failed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "payment_method.attached"
  | "payment_method.detached";

/**
 * サブスクリプションステータス変換マップ
 */
export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: "課金中",
  SUSPENDED: "一時停止",
  CANCELLED: "解約済み",
};

/**
 * サブスクリプションプランラベル
 */
export const SUBSCRIPTION_PLAN_LABELS: Record<SubscriptionPlan, string> = {
  STANDARD: "スタンダードプラン（月額12万円）",
};

/**
 * エラーメッセージ定数
 */
export const SUBSCRIPTION_ERROR_MESSAGES = {
  NOT_FOUND: "サブスクリプションが見つかりません",
  ALREADY_EXISTS: "既にサブスクリプションが存在します",
  STRIPE_ERROR: "Stripe APIエラーが発生しました",
  INVALID_STATUS: "無効なステータスです",
  PAYMENT_FAILED: "支払いに失敗しました",
  VENDOR_NOT_FOUND: "業者が見つかりません",
  UNAUTHORIZED: "この操作を行う権限がありません",
} as const;
