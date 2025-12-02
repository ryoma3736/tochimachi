import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  MessageSquare,
  DollarSign,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react';
import Link from 'next/link';

// データ取得（仮実装）
async function getDashboardData() {
  // TODO: Prismaでデータ取得
  return {
    kpis: {
      totalVendors: 287,
      totalInquiries: 1240,
      monthlyRevenue: 34440000, // 287社 × 120,000円
      waitlistCount: 45,
    },
    trends: {
      vendorsChange: 12,
      inquiriesChange: -8,
      revenueChange: 5.2,
    },
    recentActivities: [
      {
        id: '1',
        type: 'vendor_approval',
        vendor: '株式会社山田工務店',
        timestamp: '2時間前',
        status: 'success',
      },
      {
        id: '2',
        type: 'payment_failed',
        vendor: '株式会社田中建設',
        timestamp: '3時間前',
        status: 'error',
      },
      {
        id: '3',
        type: 'inquiry_received',
        vendor: '鈴木リフォーム',
        timestamp: '5時間前',
        status: 'pending',
      },
      {
        id: '4',
        type: 'vendor_application',
        vendor: '栃木工業株式会社',
        timestamp: '6時間前',
        status: 'pending',
      },
    ],
    alerts: [
      {
        id: '1',
        type: 'payment',
        message: '3社の支払いが期限切れです',
        severity: 'high',
        count: 3,
      },
      {
        id: '2',
        type: 'review',
        message: '8社の審査が保留中です',
        severity: 'medium',
        count: 8,
      },
    ],
    monthlyStats: {
      newVendors: 12,
      cancelledVendors: 2,
      inquiryRate: 4.3, // 1社あたり
      responseRate: 92,
    },
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'vendor_approval':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'payment_failed':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'inquiry_received':
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    case 'vendor_application':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
}

function getActivityLabel(type: string) {
  switch (type) {
    case 'vendor_approval':
      return '業者承認';
    case 'payment_failed':
      return '支払いエラー';
    case 'inquiry_received':
      return '問い合わせ受信';
    case 'vendor_application':
      return '新規申請';
    default:
      return '不明';
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="p-8 space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-500 mt-1">
            プラットフォーム全体の状況を確認できます
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            CSVエクスポート
          </Button>
          <Button>
            <Building2 className="w-4 h-4 mr-2" />
            業者を追加
          </Button>
        </div>
      </div>

      {/* アラート */}
      {data.alerts.length > 0 && (
        <div className="space-y-3">
          {data.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                alert.severity === 'high'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle
                  className={`w-5 h-5 ${
                    alert.severity === 'high'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                />
                <span className="font-medium text-gray-900">
                  {alert.message}
                </span>
              </div>
              <Link
                href={
                  alert.type === 'payment'
                    ? '/admin/billing'
                    : '/admin/vendors'
                }
              >
                <Button
                  size="sm"
                  variant={alert.severity === 'high' ? 'default' : 'outline'}
                >
                  確認する
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 登録業者数 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">登録業者数</p>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-3xl font-bold text-gray-900">
                  {data.kpis.totalVendors}
                </h3>
                <span className="text-sm text-gray-500">/ 300</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">
                  +{data.trends.vendorsChange}社
                </span>
                <span className="text-sm text-gray-500">今月</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${(data.kpis.totalVendors / 300) * 100}%`,
              }}
            />
          </div>
        </Card>

        {/* 問い合わせ数 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                問い合わせ数
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {data.kpis.totalInquiries.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">
                  {data.trends.inquiriesChange}%
                </span>
                <span className="text-sm text-gray-500">先月比</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* 月次売上（MRR） */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                月次売上（MRR）
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(data.kpis.monthlyRevenue)}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">
                  +{data.trends.revenueChange}%
                </span>
                <span className="text-sm text-gray-500">先月比</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* ウェイトリスト */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                ウェイトリスト
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {data.kpis.waitlistCount}
              </h3>
              <p className="text-sm text-gray-500 mt-2">社が順番待ち中</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* 統計・アクティビティ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 月次統計 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            今月の統計
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">新規登録</span>
              <span className="text-sm font-semibold text-gray-900">
                {data.monthlyStats.newVendors}社
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">解約</span>
              <span className="text-sm font-semibold text-gray-900">
                {data.monthlyStats.cancelledVendors}社
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">問い合わせ率</span>
              <span className="text-sm font-semibold text-gray-900">
                {data.monthlyStats.inquiryRate}/社
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">返信率</span>
              <span className="text-sm font-semibold text-green-600">
                {data.monthlyStats.responseRate}%
              </span>
            </div>
          </div>
        </Card>

        {/* 最近のアクティビティ */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              最近のアクティビティ
            </h3>
            <Link href="/admin/vendors">
              <Button variant="ghost" size="sm">
                すべて見る
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.vendor}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {getActivityLabel(activity.type)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  詳細
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
