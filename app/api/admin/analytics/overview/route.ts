/**
 * Analytics Overview API
 * GET /api/admin/analytics/overview
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsOverview } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const overview = await getAnalyticsOverview(start, end);

    return NextResponse.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics overview',
      },
      { status: 500 }
    );
  }
}
