import { Plus, Edit, MessageSquare, BarChart } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const actions = [
  {
    title: 'サービス追加',
    description: '新しいサービスを登録',
    icon: Plus,
    href: '/vendor/services?action=add',
    color: 'orange',
  },
  {
    title: 'プロフィール編集',
    description: '会社情報を更新',
    icon: Edit,
    href: '/vendor/profile',
    color: 'blue',
  },
  {
    title: '問い合わせ対応',
    description: '未対応の問い合わせを確認',
    icon: MessageSquare,
    href: '/vendor/inquiries',
    color: 'green',
  },
  {
    title: 'レポート確認',
    description: '月次レポートを表示',
    icon: BarChart,
    href: '/vendor/analytics',
    color: 'purple',
  },
];

export function QuickActions() {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">クイックアクション</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto w-full justify-start space-x-3 p-4 hover:border-orange-200 hover:bg-orange-50"
                >
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
