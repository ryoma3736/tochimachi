import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

// 業者データ取得（仮実装）
async function getVendors() {
  // TODO: Prismaで実データ取得
  return [
    {
      id: '1',
      companyName: '株式会社山田工務店',
      email: 'yamada@example.com',
      category: '建設・リフォーム',
      status: 'ACTIVE',
      subscriptionStatus: 'ACTIVE',
      displayOrder: 1,
      createdAt: '2025-01-15',
      approvedAt: '2025-01-16',
      lastPaymentAt: '2025-12-01',
      inquiryCount: 48,
      responseRate: 95,
    },
    {
      id: '2',
      companyName: '田中建設株式会社',
      email: 'tanaka@example.com',
      category: '建設・リフォーム',
      status: 'ACTIVE',
      subscriptionStatus: 'SUSPENDED',
      displayOrder: 2,
      createdAt: '2025-01-20',
      approvedAt: '2025-01-21',
      lastPaymentAt: '2025-10-01',
      inquiryCount: 32,
      responseRate: 78,
    },
    {
      id: '3',
      companyName: '栃木飲食グループ',
      email: 'tochigi-food@example.com',
      category: '飲食店',
      status: 'PENDING',
      subscriptionStatus: null,
      displayOrder: null,
      createdAt: '2025-12-01',
      approvedAt: null,
      lastPaymentAt: null,
      inquiryCount: 0,
      responseRate: 0,
    },
    {
      id: '4',
      companyName: '鈴木リフォーム',
      email: 'suzuki@example.com',
      category: '建設・リフォーム',
      status: 'ACTIVE',
      subscriptionStatus: 'ACTIVE',
      displayOrder: 3,
      createdAt: '2025-02-10',
      approvedAt: '2025-02-11',
      lastPaymentAt: '2025-12-01',
      inquiryCount: 64,
      responseRate: 98,
    },
    {
      id: '5',
      companyName: '佐藤小売株式会社',
      email: 'sato@example.com',
      category: '小売・卸売',
      status: 'REJECTED',
      subscriptionStatus: null,
      displayOrder: null,
      createdAt: '2025-11-25',
      approvedAt: null,
      lastPaymentAt: null,
      inquiryCount: 0,
      responseRate: 0,
    },
  ];
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          承認済み
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          審査中
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          却下
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getSubscriptionBadge(status: string | null) {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          課金中
        </Badge>
      );
    case 'SUSPENDED':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertTriangle className="w-3 h-3 mr-1" />
          停止中
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          解約済み
        </Badge>
      );
    default:
      return <Badge variant="outline">未設定</Badge>;
  }
}

export default async function VendorsPage() {
  const vendors = await getVendors();

  return (
    <div className="p-8 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">業者管理</h1>
          <p className="text-gray-500 mt-1">
            登録業者の審査・管理・ステータス変更
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            CSVエクスポート
          </Button>
          <Link href="/admin/vendors/new">
            <Button>
              <Building2 className="w-4 h-4 mr-2" />
              業者を追加
            </Button>
          </Link>
        </div>
      </div>

      {/* フィルター・検索 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 検索 */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="会社名・メールアドレスで検索"
                className="pl-10"
              />
            </div>
          </div>

          {/* カテゴリフィルター */}
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのカテゴリ</SelectItem>
              <SelectItem value="construction">建設・リフォーム</SelectItem>
              <SelectItem value="food">飲食店</SelectItem>
              <SelectItem value="retail">小売・卸売</SelectItem>
              <SelectItem value="service">サービス業</SelectItem>
            </SelectContent>
          </Select>

          {/* ステータスフィルター */}
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのステータス</SelectItem>
              <SelectItem value="active">承認済み</SelectItem>
              <SelectItem value="pending">審査中</SelectItem>
              <SelectItem value="rejected">却下</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* 業者一覧 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  表示順
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  会社名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  課金状況
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  問い合わせ数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  返信率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  登録日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {vendor.displayOrder || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {vendor.companyName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {vendor.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {vendor.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(vendor.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSubscriptionBadge(vendor.subscriptionStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {vendor.inquiryCount}件
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        vendor.responseRate >= 90
                          ? 'text-green-600'
                          : vendor.responseRate >= 70
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}
                    >
                      {vendor.responseRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {vendor.createdAt}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link href={`/admin/vendors/${vendor.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        詳細
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            全 {vendors.length} 件中 1-{vendors.length} 件を表示
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
