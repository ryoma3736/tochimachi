'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Calendar,
  DollarSign,
  Download,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  invoiceUrl?: string;
}

const mockHistory: PaymentHistory[] = [
  {
    id: '2025-12',
    date: '2025-12-01',
    amount: 120000,
    status: 'success',
    invoiceUrl: '/invoices/2025-12.pdf',
  },
  {
    id: '2025-11',
    date: '2025-11-01',
    amount: 120000,
    status: 'success',
    invoiceUrl: '/invoices/2025-11.pdf',
  },
  {
    id: '2025-10',
    date: '2025-10-01',
    amount: 120000,
    status: 'success',
    invoiceUrl: '/invoices/2025-10.pdf',
  },
  {
    id: '2025-09',
    date: '2025-09-01',
    amount: 120000,
    status: 'success',
    invoiceUrl: '/invoices/2025-09.pdf',
  },
];

const statusConfig = {
  success: { label: '支払済み', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  pending: { label: '処理中', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  failed: { label: '失敗', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export default function VendorBilling() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">課金管理</h1>
        <p className="mt-2 text-gray-600">サブスクリプション情報と支払い履歴を確認できます</p>
      </div>

      {/* Current Plan */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-orange-600 p-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">スタンダードプラン</h2>
                  <Badge className="mt-1 bg-green-100 text-green-800">アクティブ</Badge>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">月額料金</p>
                  <p className="text-3xl font-bold text-gray-900">¥120,000</p>
                  <p className="text-sm text-gray-600">税込</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">次回請求日</p>
                  <p className="text-xl font-semibold text-gray-900">2025年12月28日</p>
                  <p className="text-sm text-gray-600">自動更新</p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium text-gray-900">プランに含まれる内容:</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">無制限の問い合わせ対応</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Instagram連携</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">写真ギャラリー無制限</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">優先表示</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">分析レポート</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">優先サポート</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">お支払い方法</h3>
            <Button variant="outline" size="sm">
              変更
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-gray-100 p-4">
              <CreditCard className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">クレジットカード</p>
              <p className="text-sm text-gray-600">**** **** **** 4242</p>
              <p className="text-xs text-gray-500">有効期限: 12/2028</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">今月の請求額</p>
                <p className="text-2xl font-bold text-gray-900">¥120,000</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">年間支払額</p>
                <p className="text-2xl font-bold text-gray-900">¥1,440,000</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">利用開始日</p>
                <p className="text-lg font-semibold text-gray-900">2025年1月1日</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">支払い履歴</h3>
          <div className="space-y-4">
            {mockHistory.map((payment) => {
              const StatusIcon = statusConfig[payment.status].icon;
              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.date}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={statusConfig[payment.status].color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[payment.status].label}
                        </Badge>
                        <span className="text-sm text-gray-600">請求ID: {payment.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold text-gray-900">
                      ¥{payment.amount.toLocaleString()}
                    </p>
                    {payment.invoiceUrl && (
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        領収書
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Button variant="ghost" size="sm">
              もっと見る
            </Button>
          </div>
        </div>
      </Card>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900">お支払いについて</h4>
              <p className="mt-1 text-sm text-gray-700">
                お支払いに関するご質問やプランの変更については、サポートチームまでお問い合わせください。
              </p>
              <div className="mt-3 flex items-center space-x-4 text-sm">
                <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                  サポートに連絡
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                  よくある質問
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
