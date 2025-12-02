/**
 * GET /api/vendor/subscription
 * 現在のサブスクリプション情報を取得
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getSubscription,
  getInvoices,
  stripe,
} from "@/lib/stripe";
import {
  SubscriptionDetails,
  SUBSCRIPTION_ERROR_MESSAGES,
} from "@/lib/types/subscription";

export async function GET(req: NextRequest) {
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

    // サブスクリプション情報を取得
    const subscription = await prisma.subscription.findUnique({
      where: { vendorId },
      include: {
        vendor: {
          select: {
            id: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: SUBSCRIPTION_ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Stripeから最新情報を取得
    let stripeSubscription = null;
    let upcomingInvoice = null;
    let paymentMethod = null;

    if (subscription.stripeSubscriptionId) {
      try {
        // サブスクリプション詳細
        stripeSubscription = await getSubscription(
          subscription.stripeSubscriptionId
        );

        // 次回請求情報
        const invoices = await getInvoices(
          subscription.stripeCustomerId!,
          1
        );
        if (invoices.length > 0) {
          const invoice = invoices[0];
          upcomingInvoice = {
            amount: invoice.amount_due,
            dueDate: new Date(invoice.due_date! * 1000),
          };
        }

        // 支払い方法情報
        if (subscription.paymentMethodId) {
          const pm = await stripe.paymentMethods.retrieve(
            subscription.paymentMethodId
          );
          if (pm.card) {
            paymentMethod = {
              brand: pm.card.brand,
              last4: pm.card.last4,
              expMonth: pm.card.exp_month,
              expYear: pm.card.exp_year,
            };
          }
        }
      } catch (error) {
        console.error("Stripe情報取得エラー:", error);
        // Stripeエラーでも基本情報は返す
      }
    }

    const response: SubscriptionDetails = {
      ...subscription,
      upcomingInvoice: upcomingInvoice || undefined,
      paymentMethod: paymentMethod || undefined,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("サブスクリプション取得エラー:", error);
    return NextResponse.json(
      {
        error: "サブスクリプション情報の取得に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
