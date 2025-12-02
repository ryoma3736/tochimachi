/**
 * Monthly Report Generation API
 * GET /api/admin/analytics/report?year=2025&month=12
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateMonthlyReport } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    if (month < 1 || month > 12) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid month parameter (must be 1-12)',
        },
        { status: 400 }
      );
    }

    const report = await generateMonthlyReport(year, month);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Monthly report generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate monthly report',
      },
      { status: 500 }
    );
  }
}
