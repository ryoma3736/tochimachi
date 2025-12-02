/**
 * Revenue Analytics API
 * GET /api/admin/analytics/revenue
 */

import { NextResponse } from 'next/server';
import { getRevenueAnalytics } from '@/lib/analytics';

export async function GET() {
  try {
    const revenueData = await getRevenueAnalytics();

    return NextResponse.json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch revenue analytics',
      },
      { status: 500 }
    );
  }
}
