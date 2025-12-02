import { MessageSquare, Eye, CreditCard, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/vendor/StatCard';
import { QuickActions } from '@/components/vendor/QuickActions';
import { RecentInquiries } from '@/components/vendor/RecentInquiries';

export default function VendorDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-2 text-gray-600">業務の概要と最新の活動を確認できます</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="今月の問い合わせ"
          value={24}
          icon={MessageSquare}
          trend={{ value: 12, label: '先月比', isPositive: true }}
        />
        <StatCard
          title="プロフィール閲覧数"
          value={1248}
          icon={Eye}
          trend={{ value: 8, label: '先月比', isPositive: true }}
        />
        <StatCard
          title="課金ステータス"
          value="¥120,000"
          icon={CreditCard}
          trend={{ value: 0, label: '月額固定', isPositive: true }}
        />
        <StatCard
          title="成約率"
          value="32%"
          icon={TrendingUp}
          trend={{ value: 5, label: '先月比', isPositive: true }}
        />
      </div>

      {/* Quick Actions and Recent Inquiries */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <RecentInquiries />
      </div>

      {/* Subscription Status */}
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-orange-900">スタンダードプラン</h3>
            <p className="mt-1 text-sm text-orange-700">
              月額 ¥120,000 - 次回請求日: 2025年12月28日
            </p>
            <div className="mt-4 space-y-2 text-sm text-orange-800">
              <p>✓ 無制限の問い合わせ対応</p>
              <p>✓ Instagram連携</p>
              <p>✓ 写真ギャラリー無制限</p>
              <p>✓ 優先表示</p>
            </div>
          </div>
          <div className="rounded-lg bg-orange-100 px-4 py-2">
            <p className="text-sm font-medium text-orange-900">アクティブ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
