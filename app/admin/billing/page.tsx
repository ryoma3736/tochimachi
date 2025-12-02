import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';

// 課金データ取得（仮実装）
async function getBillingData() {
  // TODO: Prismaで実データ取得
  return {
    summary: {
      totalMRR: 34440000, // 287社 × 120,000円
      successfulPayments: 284,
      failedPayments: 3,
      pendingPayments: 0,
      collectionRate: 98.95,
    },
    payments: [
      {
        id: '1',
        vendorId: 'v1',
        vendorName: '株式会社山田工務店',
        amount: 120000,
        status: 'succeeded',
        billingDate: '2025-12-01',
        paidAt: '2025-12-01T10:30:00Z',
        paymentMethod: 'カード',
        stripeInvoiceId: 'in_1234567890',
      },
      {
        id: '2',
        vendorId: 'v2',
        vendorName: '田中建設株式会社',
        amount: 120000,
        status: 'failed',
        billingDate: '2025-12-01',
        paidAt: null,
        paymentMethod: 'カード',
        stripeInvoiceId: 'in_0987654321',
        failureReason: 'カード有効期限切れ',
        retryCount: 2,
      },
      {
        id: '3',
        vendorId: 'v3',
        vendorName: '鈴木リフォーム',
        amount: 120000,
        status: 'succeeded',
        billingDate: '2025-12-01',
        paidAt: '2025-12-01T11:15:00Z',
        paymentMethod: 'カード',
        stripeInvoiceId: 'in_1122334455',
      },
      {
        id: '4',
        vendorId: 'v4',
        vendorName: '佐藤工業株式会社',
        amount: 120000,
        status: 'failed',
        billingDate: '2025-11-01',
        paidAt: null,
        paymentMethod: 'カード',
        stripeInvoiceId: 'in_9988776655',
        failureReason: 'カード情報不正',
        retryCount: 3,
      },
      {
        id: '5',
        vendorName: '栃木飲食グループ',
        vendorId: 'v5',
        amount: 120000,
        status: 'succeeded',
        billingDate: '2025-12-01',
        paidAt: '2025-12-01T09:45:00Z',
        paymentMethod: 'カード',
        stripeInvoiceId: 'in_5544332211',
      },
    ],
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'succeeded':
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          成功
        </Badge>
      );
    case 'failed':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertTriangle className="w-3 h-3 mr-1" />
          失敗
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          処理中
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function BillingPage() {
  const data = await getBillingData();

  return (
    <div className="p-8 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">課金管理</h1>
          <p className="text-gray-500 mt-1">
            サブスクリプション課金の管理と請求書発行
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            レポートをエクスポート
          </Button>
        </div>
      </div>

      {/* 支払い失敗アラート */}
      {data.summary.failedPayments > 0 && (
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-gray-900">
                {data.summary.failedPayments}件の支払いが失敗しています
              </p>
              <p className="text-sm text-gray-600">
                業者への通知とリトライ処理を確認してください
              </p>
            </div>
          </div>
          <Button size="sm">対応する</Button>
        </div>
      )}

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 月次売上（MRR） */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                月次売上（MRR）
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(data.summary.totalMRR)}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+5.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* 成功した支払い */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">成功した支払い</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {data.summary.successfulPayments}
              </h3>
              <p className="text-sm text-gray-500 mt-2">今月の請求</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* 失敗した支払い */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                失敗した支払い
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-2">
                {data.summary.failedPayments}
              </h3>
              <p className="text-sm text-gray-500 mt-2">対応が必要</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        {/* 回収率 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">回収率</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {data.summary.collectionRate}%
              </h3>
              <p className="text-sm text-green-600 mt-2">優良</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* フィルター */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ステータスフィルター */}
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのステータス</SelectItem>
              <SelectItem value="succeeded">成功</SelectItem>
              <SelectItem value="failed">失敗</SelectItem>
              <SelectItem value="pending">処理中</SelectItem>
            </SelectContent>
          </Select>

          {/* 期間フィルター */}
          <Select defaultValue="current">
            <SelectTrigger>
              <SelectValue placeholder="期間" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">今月</SelectItem>
              <SelectItem value="last">先月</SelectItem>
              <SelectItem value="3months">過去3ヶ月</SelectItem>
              <SelectItem value="all">全期間</SelectItem>
            </SelectContent>
          </Select>

          {/* 支払方法フィルター */}
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="支払方法" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての支払方法</SelectItem>
              <SelectItem value="card">クレジットカード</SelectItem>
              <SelectItem value="bank">銀行振込</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* 支払い一覧 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  業者名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支払日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支払方法
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/vendors/${payment.vendorId}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {payment.vendorName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {payment.billingDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {payment.paidAt ? formatDate(payment.paidAt) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                    {payment.status === 'failed' && payment.failureReason && (
                      <p className="text-xs text-red-600 mt-1">
                        {payment.failureReason}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      請求書
                    </Button>
                    {payment.status === 'failed' && (
                      <Button variant="outline" size="sm">
                        再請求
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            全 {data.payments.length} 件中 1-{data.payments.length} 件を表示
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              前へ
            </Button>
            <Button variant="outline" size="sm" disabled>
              次へ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
