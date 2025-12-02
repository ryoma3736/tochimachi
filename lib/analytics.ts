/**
 * Analytics Utility Library
 * ビジネス分析・レポート機能のためのユーティリティ
 */

import { PrismaClient, InquiryStatus } from '@prisma/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

const prisma = new PrismaClient();

/**
 * 概要データの取得
 */
export interface AnalyticsOverview {
  totalVendors: number;
  activeVendors: number;
  totalInquiries: number;
  totalUsers: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageResponseTime: number; // 平均返信時間（時間単位）
}

export async function getAnalyticsOverview(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsOverview> {
  const dateFilter = {
    ...(startDate && endDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {}),
  };

  const [
    totalVendors,
    activeVendors,
    totalInquiries,
    totalUsers,
    subscriptions,
    inquiriesWithResponse,
  ] = await Promise.all([
    // 総業者数
    prisma.vendor.count(),

    // アクティブ業者数（承認済み）
    prisma.vendor.count({
      where: { isActive: true, approvedAt: { not: null } },
    }),

    // 総問い合わせ数
    prisma.inquiry.count({
      where: dateFilter,
    }),

    // 総ユーザー数
    prisma.user.count({
      where: dateFilter,
    }),

    // アクティブなサブスクリプション
    prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      select: { monthlyFee: true },
    }),

    // 返信済み問い合わせ（コンバージョン計算用）
    prisma.inquiry.findMany({
      where: {
        status: InquiryStatus.REPLIED,
        submittedAt: { not: null },
        repliedAt: { not: null },
        ...dateFilter,
      },
      select: {
        submittedAt: true,
        repliedAt: true,
      },
    }),
  ]);

  // 月次売上計算（月額12万円固定）
  const monthlyRevenue = subscriptions.reduce(
    (sum, sub) => sum + Number(sub.monthlyFee),
    0
  );

  // コンバージョン率（送信済み問い合わせのうち返信があった割合）
  const submittedInquiries = await prisma.inquiry.count({
    where: {
      status: { in: [InquiryStatus.SUBMITTED, InquiryStatus.REPLIED] },
      ...dateFilter,
    },
  });

  const conversionRate =
    submittedInquiries > 0
      ? (inquiriesWithResponse.length / submittedInquiries) * 100
      : 0;

  // 平均返信時間（時間単位）
  const responseTimes = inquiriesWithResponse
    .filter((inq) => inq.submittedAt && inq.repliedAt)
    .map((inq) => {
      const submitted = inq.submittedAt!.getTime();
      const replied = inq.repliedAt!.getTime();
      return (replied - submitted) / (1000 * 60 * 60); // ミリ秒から時間に変換
    });

  const averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

  return {
    totalVendors,
    activeVendors,
    totalInquiries,
    totalUsers,
    monthlyRevenue,
    conversionRate: Math.round(conversionRate * 100) / 100,
    averageResponseTime: Math.round(averageResponseTime * 100) / 100,
  };
}

/**
 * 業者パフォーマンスデータ
 */
export interface VendorPerformance {
  vendorId: string;
  companyName: string;
  category: string;
  inquiryCount: number;
  responseRate: number; // 返信率（%）
  averageResponseTime: number; // 平均返信時間（時間）
  revenue: number; // 月額収益
  isActive: boolean;
}

export async function getVendorPerformance(
  limit = 100,
  sortBy: 'inquiries' | 'responseRate' | 'revenue' = 'inquiries'
): Promise<VendorPerformance[]> {
  const vendors = await prisma.vendor.findMany({
    include: {
      category: true,
      inquiries: {
        where: {
          status: { not: InquiryStatus.DRAFT },
        },
        select: {
          status: true,
          submittedAt: true,
          repliedAt: true,
        },
      },
      subscription: {
        select: {
          monthlyFee: true,
          status: true,
        },
      },
    },
    take: limit,
  });

  const performance: VendorPerformance[] = vendors.map((vendor) => {
    const inquiryCount = vendor.inquiries.length;
    const repliedCount = vendor.inquiries.filter(
      (inq) => inq.status === InquiryStatus.REPLIED
    ).length;

    const responseRate = inquiryCount > 0 ? (repliedCount / inquiryCount) * 100 : 0;

    const responseTimes = vendor.inquiries
      .filter((inq) => inq.submittedAt && inq.repliedAt)
      .map((inq) => {
        const submitted = inq.submittedAt!.getTime();
        const replied = inq.repliedAt!.getTime();
        return (replied - submitted) / (1000 * 60 * 60);
      });

    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : 0;

    const revenue =
      vendor.subscription?.status === 'ACTIVE'
        ? Number(vendor.subscription.monthlyFee)
        : 0;

    return {
      vendorId: vendor.id,
      companyName: vendor.companyName,
      category: vendor.category.name,
      inquiryCount,
      responseRate: Math.round(responseRate * 100) / 100,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      revenue,
      isActive: vendor.isActive,
    };
  });

  // ソート
  performance.sort((a, b) => {
    switch (sortBy) {
      case 'inquiries':
        return b.inquiryCount - a.inquiryCount;
      case 'responseRate':
        return b.responseRate - a.responseRate;
      case 'revenue':
        return b.revenue - a.revenue;
      default:
        return 0;
    }
  });

  return performance;
}

/**
 * 問い合わせ分析データ
 */
export interface InquiryAnalytics {
  totalInquiries: number;
  byStatus: {
    draft: number;
    submitted: number;
    replied: number;
    closed: number;
  };
  byCategory: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  timeline: Array<{
    date: string;
    count: number;
    replied: number;
  }>;
}

export async function getInquiryAnalytics(
  startDate?: Date,
  endDate?: Date
): Promise<InquiryAnalytics> {
  const dateFilter = {
    ...(startDate && endDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {}),
  };

  const [totalInquiries, inquiries, inquiriesByCategory] = await Promise.all([
    prisma.inquiry.count({ where: dateFilter }),

    prisma.inquiry.findMany({
      where: dateFilter,
      select: {
        status: true,
        createdAt: true,
      },
    }),

    prisma.inquiry.groupBy({
      by: ['vendorId'],
      where: dateFilter,
      _count: {
        id: true,
      },
    }),
  ]);

  // ステータス別集計
  const byStatus = {
    draft: inquiries.filter((inq) => inq.status === InquiryStatus.DRAFT).length,
    submitted: inquiries.filter((inq) => inq.status === InquiryStatus.SUBMITTED)
      .length,
    replied: inquiries.filter((inq) => inq.status === InquiryStatus.REPLIED).length,
    closed: inquiries.filter((inq) => inq.status === InquiryStatus.CLOSED).length,
  };

  // カテゴリ別集計
  const vendorCategories = await prisma.vendor.findMany({
    where: {
      id: { in: inquiriesByCategory.map((inq) => inq.vendorId) },
    },
    include: {
      category: true,
    },
  });

  const categoryMap = new Map<string, number>();
  inquiriesByCategory.forEach((inq) => {
    const vendor = vendorCategories.find((v) => v.id === inq.vendorId);
    if (vendor) {
      const categoryName = vendor.category.name;
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + inq._count.id);
    }
  });

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: totalInquiries > 0 ? (count / totalInquiries) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // タイムライン集計（日別）
  const timelineMap = new Map<string, { count: number; replied: number }>();
  inquiries.forEach((inq) => {
    const dateKey = format(inq.createdAt, 'yyyy-MM-dd');
    const existing = timelineMap.get(dateKey) || { count: 0, replied: 0 };
    existing.count += 1;
    if (inq.status === InquiryStatus.REPLIED) {
      existing.replied += 1;
    }
    timelineMap.set(dateKey, existing);
  });

  const timeline = Array.from(timelineMap.entries())
    .map(([date, data]) => ({
      date,
      count: data.count,
      replied: data.replied,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalInquiries,
    byStatus,
    byCategory,
    timeline,
  };
}

/**
 * 売上分析データ
 */
export interface RevenueAnalytics {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  growthRate: number; // 成長率（%）
  averageRevenuePerVendor: number;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    activeVendors: number;
  }>;
  projectedAnnualRevenue: number;
}

export async function getRevenueAnalytics(): Promise<RevenueAnalytics> {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const previousMonthStart = startOfMonth(subMonths(now, 1));
  const previousMonthEnd = endOfMonth(subMonths(now, 1));

  // 当月のアクティブサブスクリプション
  const currentMonthSubs = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
      currentPeriodStart: { lte: currentMonthEnd },
      currentPeriodEnd: { gte: currentMonthStart },
    },
    select: { monthlyFee: true },
  });

  const currentMonthRevenue = currentMonthSubs.reduce(
    (sum, sub) => sum + Number(sub.monthlyFee),
    0
  );

  // 前月のアクティブサブスクリプション
  const previousMonthSubs = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
      currentPeriodStart: { lte: previousMonthEnd },
      currentPeriodEnd: { gte: previousMonthStart },
    },
    select: { monthlyFee: true },
  });

  const previousMonthRevenue = previousMonthSubs.reduce(
    (sum, sub) => sum + Number(sub.monthlyFee),
    0
  );

  // 成長率計算
  const growthRate =
    previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 0;

  // 業者あたり平均売上
  const averageRevenuePerVendor =
    currentMonthSubs.length > 0 ? currentMonthRevenue / currentMonthSubs.length : 0;

  // 過去6ヶ月の月別集計
  const monthlyBreakdown = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));

    const monthSubs = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        currentPeriodStart: { lte: monthEnd },
        currentPeriodEnd: { gte: monthStart },
      },
      select: { monthlyFee: true },
    });

    const revenue = monthSubs.reduce((sum, sub) => sum + Number(sub.monthlyFee), 0);

    monthlyBreakdown.push({
      month: format(monthStart, 'yyyy-MM'),
      revenue,
      activeVendors: monthSubs.length,
    });
  }

  // 年間予測売上（現在の月次売上 × 12）
  const projectedAnnualRevenue = currentMonthRevenue * 12;

  return {
    currentMonthRevenue,
    previousMonthRevenue,
    growthRate: Math.round(growthRate * 100) / 100,
    averageRevenuePerVendor: Math.round(averageRevenuePerVendor * 100) / 100,
    monthlyBreakdown,
    projectedAnnualRevenue,
  };
}

/**
 * CSV エクスポート用データ変換
 */
export function convertToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // ヘッダー行
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
    ),
  ];

  return csvRows.join('\n');
}

/**
 * 月次レポート生成
 */
export interface MonthlyReport {
  period: string;
  overview: AnalyticsOverview;
  topVendors: VendorPerformance[];
  inquiryAnalytics: InquiryAnalytics;
  revenueAnalytics: RevenueAnalytics;
  generatedAt: Date;
}

export async function generateMonthlyReport(
  year: number,
  month: number
): Promise<MonthlyReport> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = endOfMonth(startDate);

  const [overview, topVendors, inquiryAnalytics, revenueAnalytics] =
    await Promise.all([
      getAnalyticsOverview(startDate, endDate),
      getVendorPerformance(10, 'inquiries'),
      getInquiryAnalytics(startDate, endDate),
      getRevenueAnalytics(),
    ]);

  return {
    period: format(startDate, 'yyyy-MM'),
    overview,
    topVendors,
    inquiryAnalytics,
    revenueAnalytics,
    generatedAt: new Date(),
  };
}
