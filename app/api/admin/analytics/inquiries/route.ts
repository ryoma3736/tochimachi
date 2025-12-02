/**
 * Inquiry Analytics API
 * GET /api/admin/analytics/inquiries
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInquiryAnalytics } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const inquiryData = await getInquiryAnalytics(start, end);

    return NextResponse.json({
      success: true,
      data: inquiryData,
    });
  } catch (error) {
    console.error('Inquiry analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch inquiry analytics',
      },
      { status: 500 }
    );
  }
}
