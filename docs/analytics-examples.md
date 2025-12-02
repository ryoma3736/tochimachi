# 分析機能 使用例集

## クイックスタート

### 1. ダッシュボードへのアクセス

```bash
# 開発サーバー起動
npm run dev

# ブラウザでアクセス
http://localhost:3000/admin/analytics
```

### 2. APIの基本的な使用

```typescript
// 概要データ取得
const response = await fetch('/api/admin/analytics/overview');
const { data } = await response.json();

console.log(`総業者数: ${data.totalVendors}`);
console.log(`月次売上: ¥${data.monthlyRevenue.toLocaleString()}`);
```

## ユースケース別実装例

### 1. リアルタイムKPIモニター

```tsx
'use client';

import { useEffect, useState } from 'react';

export function RealTimeKPI() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // 初回取得
    fetchMetrics();

    // 30秒ごとに更新
    const interval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    const response = await fetch('/api/admin/analytics/overview');
    const { data } = await response.json();
    setMetrics(data);
  };

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <KPICard
        title="登録業者数"
        value={metrics.totalVendors}
        unit="社"
        trend="+5%"
      />
      <KPICard
        title="月次売上"
        value={`¥${metrics.monthlyRevenue.toLocaleString()}`}
        trend="+12%"
      />
      <KPICard
        title="問い合わせ数"
        value={metrics.totalInquiries}
        unit="件"
        trend="+8%"
      />
      <KPICard
        title="コンバージョン率"
        value={`${metrics.conversionRate}%`}
        trend="+2%"
      />
    </div>
  );
}

function KPICard({ title, value, unit = '', trend }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-3xl font-bold mt-2">
        {value}
        {unit && <span className="text-sm ml-2">{unit}</span>}
      </p>
      <p className="text-sm text-green-600 mt-2">{trend}</p>
    </div>
  );
}
```

### 2. 業者パフォーマンスランキング

```tsx
import { useState, useEffect } from 'react';

export function VendorRanking() {
  const [vendors, setVendors] = useState([]);
  const [sortBy, setSortBy] = useState('inquiries');

  useEffect(() => {
    fetchVendors();
  }, [sortBy]);

  const fetchVendors = async () => {
    const response = await fetch(
      `/api/admin/analytics/vendors?limit=20&sortBy=${sortBy}`
    );
    const { data } = await response.json();
    setVendors(data);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSortBy('inquiries')}
          className={sortBy === 'inquiries' ? 'btn-primary' : 'btn-secondary'}
        >
          問い合わせ数順
        </button>
        <button
          onClick={() => setSortBy('responseRate')}
          className={sortBy === 'responseRate' ? 'btn-primary' : 'btn-secondary'}
        >
          返信率順
        </button>
        <button
          onClick={() => setSortBy('revenue')}
          className={sortBy === 'revenue' ? 'btn-primary' : 'btn-secondary'}
        >
          売上順
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th>順位</th>
            <th>会社名</th>
            <th>カテゴリ</th>
            <th>問い合わせ数</th>
            <th>返信率</th>
            <th>月額収益</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, index) => (
            <tr key={vendor.vendorId}>
              <td>#{index + 1}</td>
              <td>{vendor.companyName}</td>
              <td>{vendor.category}</td>
              <td>{vendor.inquiryCount}件</td>
              <td>{vendor.responseRate}%</td>
              <td>¥{vendor.revenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 3. 期間指定レポート

```tsx
import { useState } from 'react';
import { format, subMonths } from 'date-fns';

export function DateRangeReport() {
  const [startDate, setStartDate] = useState(
    format(subMonths(new Date(), 1), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    const response = await fetch(
      `/api/admin/analytics/overview?startDate=${startDate}&endDate=${endDate}`
    );
    const { data } = await response.json();
    setReport(data);
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={generateReport} className="btn-primary">
          レポート生成
        </button>
      </div>

      {report && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3>問い合わせ総数</h3>
            <p className="text-2xl font-bold">{report.totalInquiries}件</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3>売上合計</h3>
            <p className="text-2xl font-bold">
              ¥{report.monthlyRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3>コンバージョン率</h3>
            <p className="text-2xl font-bold">{report.conversionRate}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. 問い合わせ推移グラフ

```tsx
import { useEffect, useState } from 'react';
import { InquiryTrendChart } from '@/components/admin/charts';
import { format, subDays } from 'date-fns';

export function InquiryTrendDashboard() {
  const [inquiryData, setInquiryData] = useState(null);
  const [period, setPeriod] = useState('7days');

  useEffect(() => {
    fetchInquiryData();
  }, [period]);

  const fetchInquiryData = async () => {
    const endDate = new Date();
    const startDate =
      period === '7days'
        ? subDays(endDate, 7)
        : period === '30days'
        ? subDays(endDate, 30)
        : subDays(endDate, 90);

    const response = await fetch(
      `/api/admin/analytics/inquiries?startDate=${format(
        startDate,
        'yyyy-MM-dd'
      )}&endDate=${format(endDate, 'yyyy-MM-dd')}`
    );
    const { data } = await response.json();
    setInquiryData(data);
  };

  if (!inquiryData) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setPeriod('7days')}
          className={period === '7days' ? 'btn-primary' : 'btn-secondary'}
        >
          過去7日間
        </button>
        <button
          onClick={() => setPeriod('30days')}
          className={period === '30days' ? 'btn-primary' : 'btn-secondary'}
        >
          過去30日間
        </button>
        <button
          onClick={() => setPeriod('90days')}
          className={period === '90days' ? 'btn-primary' : 'btn-secondary'}
        >
          過去90日間
        </button>
      </div>

      <InquiryTrendChart data={inquiryData.timeline} />

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm text-gray-600">カート追加</p>
          <p className="text-xl font-bold">{inquiryData.byStatus.draft}件</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm text-gray-600">送信済み</p>
          <p className="text-xl font-bold">{inquiryData.byStatus.submitted}件</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-600">返信済み</p>
          <p className="text-xl font-bold">{inquiryData.byStatus.replied}件</p>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <p className="text-sm text-gray-600">完了</p>
          <p className="text-xl font-bold">{inquiryData.byStatus.closed}件</p>
        </div>
      </div>
    </div>
  );
}
```

### 5. 業種別分析

```tsx
import { useEffect, useState } from 'react';
import { CategoryDistributionChart } from '@/components/admin/charts';

export function CategoryAnalysis() {
  const [inquiryData, setInquiryData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/admin/analytics/inquiries');
    const { data } = await response.json();
    setInquiryData(data);
  };

  if (!inquiryData) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 円グラフ */}
      <div className="bg-white p-6 rounded-lg shadow">
        <CategoryDistributionChart data={inquiryData.byCategory} />
      </div>

      {/* 詳細テーブル */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">業種別詳細</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">業種</th>
              <th className="text-right py-2">件数</th>
              <th className="text-right py-2">割合</th>
            </tr>
          </thead>
          <tbody>
            {inquiryData.byCategory.map((category) => (
              <tr key={category.category} className="border-b">
                <td className="py-2">{category.category}</td>
                <td className="text-right">{category.count}件</td>
                <td className="text-right">
                  {category.percentage.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 6. 売上推移ダッシュボード

```tsx
import { useEffect, useState } from 'react';
import { RevenueChart } from '@/components/admin/charts';

export function RevenueDashboard() {
  const [revenueData, setRevenueData] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    const response = await fetch('/api/admin/analytics/revenue');
    const { data } = await response.json();
    setRevenueData(data);
  };

  if (!revenueData) return <div>Loading...</div>;

  const growthColor = revenueData.growthRate >= 0 ? 'text-green-600' : 'text-red-600';
  const growthIcon = revenueData.growthRate >= 0 ? '↑' : '↓';

  return (
    <div>
      {/* KPIカード */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">当月売上</h3>
          <p className="text-2xl font-bold mt-2">
            ¥{revenueData.currentMonthRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">前月売上</h3>
          <p className="text-2xl font-bold mt-2">
            ¥{revenueData.previousMonthRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">成長率</h3>
          <p className={`text-2xl font-bold mt-2 ${growthColor}`}>
            {growthIcon} {Math.abs(revenueData.growthRate)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">年間予測売上</h3>
          <p className="text-2xl font-bold mt-2">
            ¥{revenueData.projectedAnnualRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 売上推移グラフ */}
      <div className="bg-white p-6 rounded-lg shadow">
        <RevenueChart data={revenueData.monthlyBreakdown} />
      </div>

      {/* 月別詳細 */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold mb-4">月別詳細</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">月</th>
              <th className="text-right py-2">売上</th>
              <th className="text-right py-2">アクティブ業者数</th>
              <th className="text-right py-2">業者あたり平均</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.monthlyBreakdown.map((month) => (
              <tr key={month.month} className="border-b">
                <td className="py-2">{month.month}</td>
                <td className="text-right">
                  ¥{month.revenue.toLocaleString()}
                </td>
                <td className="text-right">{month.activeVendors}社</td>
                <td className="text-right">
                  ¥{(month.revenue / month.activeVendors).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 7. CSVエクスポート機能

```tsx
import { useState } from 'react';

export function DataExporter() {
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('vendors');

  const handleExport = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/analytics/export?type=${exportType}&format=csv`
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportType}-export-${
        new Date().toISOString().split('T')[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('エクスポート完了！');
    } catch (error) {
      console.error('Export error:', error);
      alert('エクスポートに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">データエクスポート</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          エクスポートタイプ
        </label>
        <select
          value={exportType}
          onChange={(e) => setExportType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="vendors">業者パフォーマンス</option>
          <option value="inquiries">問い合わせ分析</option>
          <option value="revenue">売上分析</option>
        </select>
      </div>

      <button
        onClick={handleExport}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'エクスポート中...' : 'CSV出力'}
      </button>
    </div>
  );
}
```

### 8. PDFレポート生成

```tsx
import { useState } from 'react';

export function PDFReportGenerator() {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/analytics/report/pdf?year=${year}&month=${month}`
      );

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monthly-report-${year}-${month
        .toString()
        .padStart(2, '0')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('PDFレポート生成完了！');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDFレポート生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">月次レポートPDF生成</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">年</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full border p-2 rounded"
            min="2020"
            max="2030"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">月</label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="w-full border p-2 rounded"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}月
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleGeneratePDF}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? '生成中...' : 'PDFレポート生成'}
      </button>
    </div>
  );
}
```

## コマンドライン使用例

### APIテスト

```bash
# 概要データ取得
curl http://localhost:3000/api/admin/analytics/overview

# 業者パフォーマンス取得（上位10件）
curl http://localhost:3000/api/admin/analytics/vendors?limit=10&sortBy=inquiries

# 問い合わせ分析取得（期間指定）
curl "http://localhost:3000/api/admin/analytics/inquiries?startDate=2025-11-01&endDate=2025-11-30"

# 売上分析取得
curl http://localhost:3000/api/admin/analytics/revenue

# CSVエクスポート
curl -o vendors.csv "http://localhost:3000/api/admin/analytics/export?type=vendors&format=csv"

# PDFレポート生成
curl -o report.pdf "http://localhost:3000/api/admin/analytics/report/pdf?year=2025&month=11"
```

## デバッグ・トラブルシューティング

### ログ出力例

```typescript
// lib/analytics.ts でデバッグログ追加
export async function getAnalyticsOverview() {
  console.time('getAnalyticsOverview');

  const result = await prisma.vendor.count();
  console.log('Total vendors:', result);

  console.timeEnd('getAnalyticsOverview');

  return result;
}
```

### エラーハンドリング例

```typescript
try {
  const data = await fetch('/api/admin/analytics/overview');
  const result = await data.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
} catch (error) {
  console.error('Analytics fetch error:', error);

  // ユーザーにフレンドリーなエラーメッセージ
  if (error.message.includes('network')) {
    alert('ネットワークエラーが発生しました');
  } else {
    alert('データの取得に失敗しました');
  }

  // エラーレポート送信（本番環境）
  if (process.env.NODE_ENV === 'production') {
    sendErrorReport(error);
  }
}
```

---

**更新日**: 2025-12-02
**バージョン**: 1.0.0
