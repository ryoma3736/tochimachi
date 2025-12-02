/**
 * Vendor Performance API
 * GET /api/admin/analytics/vendors
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVendorPerformance } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const sortBy = (searchParams.get('sortBy') ||
      'inquiries') as 'inquiries' | 'responseRate' | 'revenue';

    const vendors = await getVendorPerformance(limit, sortBy);

    return NextResponse.json({
      success: true,
      data: vendors,
      count: vendors.length,
    });
  } catch (error) {
    console.error('Vendor performance error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch vendor performance data',
      },
      { status: 500 }
    );
  }
}
