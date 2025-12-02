# 分析・レポート機能 ドキュメント

## 概要

とちまちプラットフォームの分析・レポート機能の完全実装ガイドです。

## アーキテクチャ

```
┌─────────────────────────────────────────────────┐
│         Analytics & Reporting System            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐     ┌──────────────┐         │
│  │   Frontend   │────▶│  API Layer   │         │
│  │  Dashboard   │     │  (Next.js)   │         │
│  └──────────────┘     └──────┬───────┘         │
│                              │                  │
│                              ▼                  │
│                       ┌──────────────┐          │
│                       │   Analytics  │          │
│                       │   Utilities  │          │
│                       └──────┬───────┘          │
│                              │                  │
│                              ▼                  │
│                       ┌──────────────┐          │
│                       │   Prisma DB  │          │
│                       │  (PostgreSQL)│          │
│                       └──────────────┘          │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │        Export & Reporting Layer          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────┐ │  │
│  │  │   CSV    │  │   JSON   │  │  PDF   │ │  │
│  │  └──────────┘  └──────────┘  └────────┘ │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## ディレクトリ構造

```
tochimachi/
├── app/
│   ├── admin/
│   │   └── analytics/
│   │       └── page.tsx                    # メインダッシュボード
│   └── api/
│       └── admin/
│           └── analytics/
│               ├── overview/
│               │   └── route.ts            # 概要データAPI
│               ├── vendors/
│               │   └── route.ts            # 業者パフォーマンスAPI
│               ├── inquiries/
│               │   └── route.ts            # 問い合わせ分析API
│               ├── revenue/
│               │   └── route.ts            # 売上分析API
│               ├── report/
│               │   ├── route.ts            # レポート生成API
│               │   └── pdf/
│               │       └── route.ts        # PDFレポート生成
│               └── export/
│                   └── route.ts            # CSVエクスポートAPI
├── components/
│   └── admin/
│       └── charts/
│           ├── InquiryTrendChart.tsx       # 問い合わせ推移グラフ
│           ├── CategoryDistributionChart.tsx # 業種別分布
│           ├── RevenueChart.tsx            # 売上推移
│           ├── ConversionFunnelChart.tsx   # ファネルチャート
│           └── index.ts                    # エクスポート
├── lib/
│   ├── analytics.ts                        # 分析ユーティリティ
│   └── pdf-report.ts                       # PDFレポート生成
└── docs/
    └── analytics-system.md                 # このドキュメント
```

## API エンドポイント

### 1. 概要データ取得

**エンドポイント**: `GET /api/admin/analytics/overview`

**クエリパラメータ**:
- `startDate` (optional): 開始日時 (ISO 8601形式)
- `endDate` (optional): 終了日時 (ISO 8601形式)

**レスポンス例**:
```json
{
  "success": true,
  "data": {
    "totalVendors": 50,
    "activeVendors": 45,
    "totalInquiries": 1250,
    "totalUsers": 3200,
    "monthlyRevenue": 5400000,
    "conversionRate": 85.5,
    "averageResponseTime": 4.2
  }
}
```

### 2. 業者パフォーマンス取得

**エンドポイント**: `GET /api/admin/analytics/vendors`

**クエリパラメータ**:
- `limit` (optional, default: 100): 取得件数
- `sortBy` (optional, default: "inquiries"): ソート基準
  - `inquiries`: 問い合わせ数順
  - `responseRate`: 返信率順
  - `revenue`: 売上順

**レスポンス例**:
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "vendorId": "uuid-1",
      "companyName": "ABC建設株式会社",
      "category": "建設・リフォーム",
      "inquiryCount": 45,
      "responseRate": 95.5,
      "averageResponseTime": 3.2,
      "revenue": 120000,
      "isActive": true
    }
  ]
}
```

### 3. 問い合わせ分析取得

**エンドポイント**: `GET /api/admin/analytics/inquiries`

**クエリパラメータ**:
- `startDate` (optional): 開始日時
- `endDate` (optional): 終了日時

**レスポンス例**:
```json
{
  "success": true,
  "data": {
    "totalInquiries": 1250,
    "byStatus": {
      "draft": 50,
      "submitted": 300,
      "replied": 800,
      "closed": 100
    },
    "byCategory": [
      {
        "category": "建設・リフォーム",
        "count": 450,
        "percentage": 36.0
      }
    ],
    "timeline": [
      {
        "date": "2025-12-01",
        "count": 42,
        "replied": 35
      }
    ]
  }
}
```

### 4. 売上分析取得

**エンドポイント**: `GET /api/admin/analytics/revenue`

**レスポンス例**:
```json
{
  "success": true,
  "data": {
    "currentMonthRevenue": 5400000,
    "previousMonthRevenue": 5000000,
    "growthRate": 8.0,
    "averageRevenuePerVendor": 120000,
    "monthlyBreakdown": [
      {
        "month": "2025-07",
        "revenue": 4800000,
        "activeVendors": 40
      }
    ],
    "projectedAnnualRevenue": 64800000
  }
}
```

### 5. 月次レポート生成

**エンドポイント**: `GET /api/admin/analytics/report`

**クエリパラメータ**:
- `year` (optional, default: 現在の年): 年
- `month` (optional, default: 現在の月): 月 (1-12)

**レスポンス例**:
```json
{
  "success": true,
  "data": {
    "period": "2025-12",
    "overview": { /* 概要データ */ },
    "topVendors": [ /* Top 10業者 */ ],
    "inquiryAnalytics": { /* 問い合わせ分析 */ },
    "revenueAnalytics": { /* 売上分析 */ },
    "generatedAt": "2025-12-02T12:00:00.000Z"
  }
}
```

### 6. CSVエクスポート

**エンドポイント**: `GET /api/admin/analytics/export`

**クエリパラメータ**:
- `type` (required): エクスポートタイプ
  - `vendors`: 業者パフォーマンス
  - `inquiries`: 問い合わせ分析
  - `revenue`: 売上分析
- `format` (optional, default: "csv"): フォーマット (`csv` or `json`)

**使用例**:
```bash
# CSVダウンロード
curl -o vendors.csv "http://localhost:3000/api/admin/analytics/export?type=vendors&format=csv"

# JSONレスポンス
curl "http://localhost:3000/api/admin/analytics/export?type=vendors&format=json"
```

### 7. PDFレポート生成

**エンドポイント**: `GET /api/admin/analytics/report/pdf`

**クエリパラメータ**:
- `year` (optional): 年
- `month` (optional): 月

**使用例**:
```bash
# 2025年12月のレポートPDF生成
curl -o report.pdf "http://localhost:3000/api/admin/analytics/report/pdf?year=2025&month=12"
```

## フロントエンド実装

### ダッシュボードページ

**パス**: `/app/admin/analytics/page.tsx`

**主な機能**:
- リアルタイムKPI表示
- インタラクティブなグラフ表示
- 業者ランキングテーブル
- CSV/PDFエクスポート

**使用例**:
```tsx
// ダッシュボードにアクセス
http://localhost:3000/admin/analytics
```

### チャートコンポーネント

#### 1. InquiryTrendChart (問い合わせ推移)

```tsx
import { InquiryTrendChart } from '@/components/admin/charts';

const data = [
  { date: '2025-12-01', count: 42, replied: 35 },
  { date: '2025-12-02', count: 38, replied: 30 },
];

<InquiryTrendChart data={data} />
```

#### 2. CategoryDistributionChart (業種別分布)

```tsx
import { CategoryDistributionChart } from '@/components/admin/charts';

const data = [
  { category: '建設・リフォーム', count: 450, percentage: 36.0 },
  { category: '飲食店', count: 320, percentage: 25.6 },
];

<CategoryDistributionChart data={data} />
```

#### 3. RevenueChart (売上推移)

```tsx
import { RevenueChart } from '@/components/admin/charts';

const data = [
  { month: '2025-07', revenue: 4800000, activeVendors: 40 },
  { month: '2025-08', revenue: 5200000, activeVendors: 43 },
];

<RevenueChart data={data} />
```

#### 4. ConversionFunnelChart (コンバージョンファネル)

```tsx
import { ConversionFunnelChart } from '@/components/admin/charts';

const data = {
  draft: 50,
  submitted: 300,
  replied: 800,
  closed: 100,
};

<ConversionFunnelChart data={data} />
```

## データ分析ユーティリティ

### lib/analytics.ts

**主要関数**:

#### getAnalyticsOverview()
```typescript
import { getAnalyticsOverview } from '@/lib/analytics';

const overview = await getAnalyticsOverview(
  new Date('2025-12-01'),
  new Date('2025-12-31')
);
```

#### getVendorPerformance()
```typescript
import { getVendorPerformance } from '@/lib/analytics';

const topVendors = await getVendorPerformance(
  10,        // 取得件数
  'inquiries' // ソート基準
);
```

#### getInquiryAnalytics()
```typescript
import { getInquiryAnalytics } from '@/lib/analytics';

const inquiryData = await getInquiryAnalytics(
  startDate,
  endDate
);
```

#### getRevenueAnalytics()
```typescript
import { getRevenueAnalytics } from '@/lib/analytics';

const revenueData = await getRevenueAnalytics();
```

#### generateMonthlyReport()
```typescript
import { generateMonthlyReport } from '@/lib/analytics';

const report = await generateMonthlyReport(2025, 12);
```

## PDFレポート生成

### lib/pdf-report.ts

**主要関数**:

#### generateMonthlyReportPDF()
```typescript
import { generateMonthlyReportPDF } from '@/lib/pdf-report';
import { generateMonthlyReport } from '@/lib/analytics';

const report = await generateMonthlyReport(2025, 12);
const pdfBlob = generateMonthlyReportPDF(report);

// ダウンロード
const url = URL.createObjectURL(pdfBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'monthly-report.pdf';
a.click();
```

#### generateVendorPerformancePDF()
```typescript
import { generateVendorPerformancePDF } from '@/lib/pdf-report';
import { getVendorPerformance } from '@/lib/analytics';

const vendors = await getVendorPerformance(100, 'inquiries');
const pdfBlob = generateVendorPerformancePDF(vendors);
```

## データモデル

### 主要インターフェース

```typescript
// 概要データ
interface AnalyticsOverview {
  totalVendors: number;
  activeVendors: number;
  totalInquiries: number;
  totalUsers: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageResponseTime: number;
}

// 業者パフォーマンス
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

// 問い合わせ分析
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

// 売上分析
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

// 月次レポート
interface MonthlyReport {
  period: string;
  overview: AnalyticsOverview;
  topVendors: VendorPerformance[];
  inquiryAnalytics: InquiryAnalytics;
  revenueAnalytics: RevenueAnalytics;
  generatedAt: Date;
}
```

## 使用例

### 1. 基本的なダッシュボード表示

```typescript
'use client';

import { useEffect, useState } from 'react';
import { InquiryTrendChart, RevenueChart } from '@/components/admin/charts';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/admin/analytics/overview')
      .then(res => res.json())
      .then(result => setData(result.data));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <div className="kpi-cards">
        <div>Total Vendors: {data.totalVendors}</div>
        <div>Monthly Revenue: ¥{data.monthlyRevenue.toLocaleString()}</div>
      </div>
    </div>
  );
}
```

### 2. CSVエクスポート実装

```typescript
const handleExportCSV = async (type: string) => {
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
  } catch (error) {
    console.error('Export error:', error);
    alert('エクスポートに失敗しました');
  }
};

// 使用
<button onClick={() => handleExportCSV('vendors')}>
  業者データをCSV出力
</button>
```

### 3. PDFレポート生成

```typescript
const handleGeneratePDF = async () => {
  try {
    const year = 2025;
    const month = 12;

    const response = await fetch(
      `/api/admin/analytics/report/pdf?year=${year}&month=${month}`
    );

    if (!response.ok) throw new Error('PDF generation failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-report-${year}-${month}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('PDFレポート生成に失敗しました');
  }
};

// 使用
<button onClick={handleGeneratePDF}>
  月次レポートPDF生成
</button>
```

## パフォーマンス最適化

### データベースクエリ最適化

```typescript
// 並列クエリの活用
const [overview, inquiries, revenue] = await Promise.all([
  getAnalyticsOverview(),
  getInquiryAnalytics(),
  getRevenueAnalytics(),
]);

// インデックス活用（Prisma Schema）
@@index([createdAt(sort: Desc)])
@@index([vendorId, status])
@@index([nextBillingDate, status])
```

### フロントエンド最適化

```typescript
// React.memoでチャートコンポーネントの再レンダリング防止
export const InquiryTrendChart = React.memo(({ data }) => {
  // ...
});

// useSWRでキャッシング
import useSWR from 'swr';

const { data, error } = useSWR(
  '/api/admin/analytics/overview',
  fetcher,
  { refreshInterval: 60000 } // 1分ごと更新
);
```

## エラーハンドリング

```typescript
// API側
try {
  const data = await getAnalyticsOverview();
  return NextResponse.json({ success: true, data });
} catch (error) {
  console.error('Analytics error:', error);
  return NextResponse.json(
    { success: false, error: 'Failed to fetch analytics' },
    { status: 500 }
  );
}

// クライアント側
const fetchData = async () => {
  try {
    const response = await fetch('/api/admin/analytics/overview');
    if (!response.ok) throw new Error('API request failed');
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    setData(result.data);
  } catch (error) {
    setError(error.message);
  }
};
```

## テスト

### ユニットテスト例

```typescript
// lib/analytics.test.ts
import { getAnalyticsOverview } from './analytics';

describe('Analytics Utilities', () => {
  test('getAnalyticsOverview returns correct data structure', async () => {
    const result = await getAnalyticsOverview();

    expect(result).toHaveProperty('totalVendors');
    expect(result).toHaveProperty('activeVendors');
    expect(result).toHaveProperty('monthlyRevenue');
    expect(typeof result.totalVendors).toBe('number');
    expect(result.conversionRate).toBeGreaterThanOrEqual(0);
    expect(result.conversionRate).toBeLessThanOrEqual(100);
  });
});
```

## セキュリティ

### 認証・認可

```typescript
// middleware.ts で管理者認証を実装
export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token');

  if (request.nextUrl.pathname.startsWith('/admin/analytics')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}
```

### データアクセス制限

```typescript
// API Routeで権限チェック
export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // データ取得処理
}
```

## デプロイ

### 環境変数

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/tochimachi"
```

### ビルド

```bash
# 開発環境
npm run dev

# 本番ビルド
npm run build
npm run start
```

## トラブルシューティング

### よくある問題

1. **グラフが表示されない**
   - Chart.jsの登録確認: `ChartJS.register(...)`
   - データ形式の確認

2. **CSVダウンロードが失敗する**
   - BlobURLの生成確認
   - Content-Typeヘッダーの確認

3. **PDFが生成されない**
   - jsPDFのインストール確認
   - フォント設定の確認

4. **パフォーマンスが遅い**
   - データベースインデックスの確認
   - クエリの並列化
   - キャッシング導入

## まとめ

この分析・レポート機能により、以下が実現されます:

- **リアルタイム分析**: KPIのリアルタイム表示
- **ビジュアル化**: グラフとチャートによる直感的な理解
- **データエクスポート**: CSV/PDFでのレポート出力
- **業者パフォーマンス追跡**: 問い合わせ・返信率の可視化
- **売上予測**: 月次売上推移と年間予測

## 今後の拡張案

- リアルタイムデータストリーミング (WebSocket)
- カスタムレポート作成機能
- アラート機能（KPI閾値監視）
- A/Bテスト分析
- ユーザー行動分析

---

**作成日**: 2025-12-02
**バージョン**: 1.0.0
**担当**: とちまち開発チーム
