'use client';

/**
 * Analytics Dashboard Page
 * 管理者用分析ダッシュボード
 */

import React, { useEffect, useState } from 'react';
import {
  InquiryTrendChart,
  CategoryDistributionChart,
  RevenueChart,
  ConversionFunnelChart,
} from '@/components/admin/charts';

interface AnalyticsOverview {
  totalVendors: number;
  activeVendors: number;
  totalInquiries: number;
  totalUsers: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageResponseTime: number;
}

interface InquiryAnalytics {
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

interface RevenueAnalytics {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  growthRate: number;
  averageRevenuePerVendor: number;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    activeVendors: number;
  }>;
  projectedAnnualRevenue: number;
}

interface VendorPerformance {
  vendorId: string;
  companyName: string;
  category: string;
  inquiryCount: number;
  responseRate: number;
  averageResponseTime: number;
  revenue: number;
  isActive: boolean;
}

export default function AnalyticsDashboard() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [inquiryData, setInquiryData] = useState<InquiryAnalytics | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
  const [topVendors, setTopVendors] = useState<VendorPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [overviewRes, inquiryRes, revenueRes, vendorsRes] = await Promise.all([
        fetch('/api/admin/analytics/overview'),
        fetch('/api/admin/analytics/inquiries'),
        fetch('/api/admin/analytics/revenue'),
        fetch('/api/admin/analytics/vendors?limit=10&sortBy=inquiries'),
      ]);

      if (!overviewRes.ok || !inquiryRes.ok || !revenueRes.ok || !vendorsRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [overviewData, inquiryData, revenueData, vendorsData] =
        await Promise.all([
          overviewRes.json(),
          inquiryRes.json(),
          revenueRes.json(),
          vendorsRes.json(),
        ]);

      setOverview(overviewData.data);
      setInquiryData(inquiryData.data);
      setRevenueData(revenueData.data);
      setTopVendors(vendorsData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    try {
      const response = await fetch(
        `/api/admin/analytics/export?type=${type}&format=csv`
      );
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('エクスポートに失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">エラーが発生しました</p>
          <p>{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            分析ダッシュボード
          </h1>
          <p className="text-gray-600">
            とちまちプラットフォームのビジネス分析レポート
          </p>
        </div>

        {/* KPI Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                登録業者数
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {overview.totalVendors}
                <span className="text-sm font-normal text-gray-500 ml-2">社</span>
              </p>
              <p className="text-sm text-green-600 mt-2">
                アクティブ: {overview.activeVendors}社
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                総問い合わせ数
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {overview.totalInquiries.toLocaleString()}
                <span className="text-sm font-normal text-gray-500 ml-2">件</span>
              </p>
              <p className="text-sm text-blue-600 mt-2">
                コンバージョン率: {overview.conversionRate}%
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">月次売上</h3>
              <p className="text-3xl font-bold text-gray-900">
                ¥{overview.monthlyRevenue.toLocaleString()}
              </p>
              {revenueData && (
                <p
                  className={`text-sm mt-2 ${
                    revenueData.growthRate >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {revenueData.growthRate >= 0 ? '↑' : '↓'}{' '}
                  {Math.abs(revenueData.growthRate)}% (前月比)
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                平均返信時間
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {overview.averageResponseTime.toFixed(1)}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  時間
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-2">問い合わせ→返信</p>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 問い合わせ推移 */}
          {inquiryData && (
            <div className="bg-white rounded-lg shadow p-6">
              <InquiryTrendChart data={inquiryData.timeline} />
            </div>
          )}

          {/* 業種別分布 */}
          {inquiryData && (
            <div className="bg-white rounded-lg shadow p-6">
              <CategoryDistributionChart data={inquiryData.byCategory} />
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        {revenueData && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <RevenueChart data={revenueData.monthlyBreakdown} />
          </div>
        )}

        {/* Conversion Funnel */}
        {inquiryData && (
          <div className="mb-8">
            <ConversionFunnelChart data={inquiryData.byStatus} />
          </div>
        )}

        {/* Top Vendors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              業者ランキング（問い合わせ数順）
            </h2>
            <button
              onClick={() => handleExport('vendors')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              CSV出力
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    順位
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    会社名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    問い合わせ数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    返信率
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    平均返信時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    月額収益
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topVendors.map((vendor, index) => (
                  <tr key={vendor.vendorId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.inquiryCount}件
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.responseRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.averageResponseTime.toFixed(1)}時間
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{vendor.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            データエクスポート
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleExport('vendors')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              業者パフォーマンス (CSV)
            </button>
            <button
              onClick={() => handleExport('inquiries')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              問い合わせ分析 (CSV)
            </button>
            <button
              onClick={() => handleExport('revenue')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              売上分析 (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
