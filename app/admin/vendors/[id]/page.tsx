import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  CheckCircle,
  XCircle,
  Ban,
  Clock,
  DollarSign,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 業者詳細データ取得（仮実装）
async function getVendorDetail(id: string) {
  // TODO: Prismaで実データ取得
  if (id === '999') return null; // 404テスト

  return {
    id,
    companyName: '株式会社山田工務店',
    email: 'yamada@example.com',
    status: 'ACTIVE',
    category: '建設・リフォーム',
    displayOrder: 1,
    createdAt: '2025-01-15T10:00:00Z',
    approvedAt: '2025-01-16T14:30:00Z',
    profile: {
      description:
        '栃木県宇都宮市で30年以上の実績を持つ総合リフォーム会社です。住宅リフォームから店舗改装まで幅広く対応しています。',
      logoUrl: null,
      coverImageUrl: null,
      address: '栃木県宇都宮市中央1-1-1',
      contactPhone: '028-123-4567',
      websiteUrl: 'https://yamada-koumuten.example.com',
      businessHours: {
        mon: '9:00-18:00',
        tue: '9:00-18:00',
        wed: '9:00-18:00',
        thu: '9:00-18:00',
        fri: '9:00-18:00',
        sat: '9:00-17:00',
        sun: '定休日',
      },
    },
    subscription: {
      status: 'ACTIVE',
      plan: 'STANDARD',
      monthlyFee: 120000,
      currentPeriodStart: '2025-12-01',
      currentPeriodEnd: '2025-12-31',
      nextBillingDate: '2026-01-01',
      lastPaymentAt: '2025-12-01',
      lastPaymentStatus: 'succeeded',
      failedPaymentCount: 0,
    },
    services: [
      {
        id: '1',
        name: '住宅全面リフォーム',
        price: 5000000,
        unit: '式',
        isActive: true,
      },
      {
        id: '2',
        name: 'キッチンリフォーム',
        price: 1500000,
        unit: '式',
        isActive: true,
      },
      {
        id: '3',
        name: 'バスルームリフォーム',
        price: 1200000,
        unit: '式',
        isActive: true,
      },
    ],
    stats: {
      totalInquiries: 48,
      responseRate: 95,
      averageResponseTime: 2.5, // 時間
      totalRevenue: 1440000, // 12ヶ月分
    },
    recentInquiries: [
      {
        id: '1',
        userName: '田中太郎',
        message: 'キッチンリフォームの見積もりをお願いします',
        status: 'REPLIED',
        createdAt: '2025-12-01T10:00:00Z',
        repliedAt: '2025-12-01T12:30:00Z',
      },
      {
        id: '2',
        userName: '佐藤花子',
        message: 'バスルームの改装について相談したいです',
        status: 'SUBMITTED',
        createdAt: '2025-12-02T09:15:00Z',
        repliedAt: null,
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

export default async function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const vendor = await getVendorDetail(params.id);

  if (!vendor) {
    notFound();
  }

  return (
    <div className="p-8 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/vendors"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← 業者一覧に戻る
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {vendor.companyName}
            </h1>
            <Badge
              className={
                vendor.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
              }
            >
              {vendor.status === 'ACTIVE' ? '承認済み' : '審査中'}
            </Badge>
            <Badge
              className={
                vendor.subscription.status === 'ACTIVE'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                  : 'bg-red-100 text-red-700 hover:bg-red-100'
              }
            >
              {vendor.subscription.status === 'ACTIVE' ? '課金中' : '停止中'}
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">表示順: #{vendor.displayOrder}</p>
        </div>

        <div className="flex gap-3">
          {vendor.status === 'PENDING' && (
            <>
              <Button variant="outline" className="text-red-600">
                <XCircle className="w-4 h-4 mr-2" />
                却下
              </Button>
              <Button>
                <CheckCircle className="w-4 h-4 mr-2" />
                承認
              </Button>
            </>
          )}
          {vendor.status === 'ACTIVE' && (
            <Button variant="outline" className="text-red-600">
              <Ban className="w-4 h-4 mr-2" />
              強制解約
            </Button>
          )}
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">問い合わせ数</p>
              <p className="text-2xl font-bold text-gray-900">
                {vendor.stats.totalInquiries}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">返信率</p>
              <p className="text-2xl font-bold text-green-600">
                {vendor.stats.responseRate}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均返信時間</p>
              <p className="text-2xl font-bold text-gray-900">
                {vendor.stats.averageResponseTime}h
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">累計売上</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(vendor.stats.totalRevenue)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* タブコンテンツ */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">基本情報</TabsTrigger>
          <TabsTrigger value="subscription">課金情報</TabsTrigger>
          <TabsTrigger value="services">サービス</TabsTrigger>
          <TabsTrigger value="inquiries">問い合わせ履歴</TabsTrigger>
        </TabsList>

        {/* 基本情報 */}
        <TabsContent value="info" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              会社情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  会社名
                </label>
                <p className="text-gray-900 mt-1">{vendor.companyName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  カテゴリ
                </label>
                <p className="text-gray-900 mt-1">{vendor.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  メールアドレス
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{vendor.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  電話番号
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">
                    {vendor.profile.contactPhone}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  住所
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{vendor.profile.address}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  ウェブサイト
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a
                    href={vendor.profile.websiteUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {vendor.profile.websiteUrl}
                  </a>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              営業時間
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(vendor.profile.businessHours).map(
                ([day, hours]) => (
                  <div key={day} className="text-sm">
                    <span className="font-medium text-gray-700">
                      {
                        {
                          mon: '月',
                          tue: '火',
                          wed: '水',
                          thu: '木',
                          fri: '金',
                          sat: '土',
                          sun: '日',
                        }[day]
                      }
                      :
                    </span>
                    <span className="text-gray-600 ml-2">{hours}</span>
                  </div>
                )
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              登録情報
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">登録日時</span>
                <span className="text-gray-900">
                  {formatDate(vendor.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">承認日時</span>
                <span className="text-gray-900">
                  {vendor.approvedAt ? formatDate(vendor.approvedAt) : '-'}
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 課金情報 */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                サブスクリプション情報
              </h3>
              <Badge
                className={
                  vendor.subscription.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                }
              >
                {vendor.subscription.status === 'ACTIVE'
                  ? '課金中'
                  : '停止中'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  プラン
                </label>
                <p className="text-gray-900 mt-1 font-semibold">
                  スタンダードプラン
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  月額料金
                </label>
                <p className="text-gray-900 mt-1 font-semibold text-lg">
                  {formatCurrency(vendor.subscription.monthlyFee)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  課金期間
                </label>
                <p className="text-gray-900 mt-1">
                  {vendor.subscription.currentPeriodStart} 〜{' '}
                  {vendor.subscription.currentPeriodEnd}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  次回請求日
                </label>
                <p className="text-gray-900 mt-1">
                  {vendor.subscription.nextBillingDate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  最終支払日
                </label>
                <p className="text-gray-900 mt-1">
                  {vendor.subscription.lastPaymentAt || '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  支払いステータス
                </label>
                <div className="mt-1">
                  {vendor.subscription.lastPaymentStatus === 'succeeded' ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      成功
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      失敗
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex gap-3">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  請求書を再発行
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  支払履歴を表示
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* サービス */}
        <TabsContent value="services" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              提供サービス
            </h3>
            <div className="space-y-3">
              {vendor.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatCurrency(service.price)} / {service.unit}
                    </p>
                  </div>
                  <Badge
                    className={
                      service.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }
                  >
                    {service.isActive ? '公開中' : '非公開'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 問い合わせ履歴 */}
        <TabsContent value="inquiries" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              最近の問い合わせ
            </h3>
            <div className="space-y-4">
              {vendor.recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-gray-900">
                        {inquiry.userName}
                      </p>
                      <Badge
                        className={
                          inquiry.status === 'REPLIED'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        }
                      >
                        {inquiry.status === 'REPLIED' ? '返信済み' : '未返信'}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(inquiry.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{inquiry.message}</p>
                  {inquiry.repliedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      返信日時: {formatDate(inquiry.repliedAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
