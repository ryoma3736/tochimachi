/**
 * PDF Report Generation API
 * GET /api/admin/analytics/report/pdf?year=2025&month=12
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateMonthlyReport } from '@/lib/analytics';
import { generateMonthlyReportPDF } from '@/lib/pdf-report';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(
      searchParams.get('year') || new Date().getFullYear().toString()
    );
    const month = parseInt(
      searchParams.get('month') || (new Date().getMonth() + 1).toString()
    );

    if (month < 1 || month > 12) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid month parameter (must be 1-12)',
        },
        { status: 400 }
      );
    }

    // レポートデータ生成
    const report = await generateMonthlyReport(year, month);

    // PDF生成
    const pdfBlob = generateMonthlyReportPDF(report);

    // Buffer変換
    const buffer = await pdfBlob.arrayBuffer();

    // レスポンス返却
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="monthly-report-${year}-${month.toString().padStart(2, '0')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF report generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate PDF report',
      },
      { status: 500 }
    );
  }
}
