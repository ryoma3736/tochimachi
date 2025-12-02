/**
 * Export Analytics Data API
 * GET /api/admin/analytics/export?type=vendors&format=csv
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getVendorPerformance,
  getInquiryAnalytics,
  getRevenueAnalytics,
  convertToCSV,
} from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'vendors';
    const format = searchParams.get('format') || 'csv';

    let data: Record<string, unknown>[] = [];
    let filename = 'analytics-export';

    switch (type) {
      case 'vendors': {
        const vendors = await getVendorPerformance(100, 'inquiries');
        data = vendors.map((v) => ({
          業者ID: v.vendorId,
          会社名: v.companyName,
          カテゴリ: v.category,
          問い合わせ数: v.inquiryCount,
          返信率: `${v.responseRate}%`,
          平均返信時間: `${v.averageResponseTime}時間`,
          月額収益: `¥${v.revenue.toLocaleString()}`,
          ステータス: v.isActive ? 'アクティブ' : '非アクティブ',
        }));
        filename = 'vendor-performance';
        break;
      }

      case 'inquiries': {
        const inquiries = await getInquiryAnalytics();
        data = inquiries.byCategory.map((c) => ({
          カテゴリ: c.category,
          問い合わせ数: c.count,
          割合: `${c.percentage.toFixed(2)}%`,
        }));
        filename = 'inquiry-analytics';
        break;
      }

      case 'revenue': {
        const revenue = await getRevenueAnalytics();
        data = revenue.monthlyBreakdown.map((m) => ({
          月: m.month,
          売上: `¥${m.revenue.toLocaleString()}`,
          アクティブ業者数: m.activeVendors,
        }));
        filename = 'revenue-analytics';
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid export type',
          },
          { status: 400 }
        );
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      const timestamp = new Date().toISOString().split('T')[0];

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}-${timestamp}.csv"`,
        },
      });
    } else if (format === 'json') {
      return NextResponse.json({
        success: true,
        data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid format (use csv or json)',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export analytics data',
      },
      { status: 500 }
    );
  }
}
