import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Tag,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle,
} from 'lucide-react';

// 設定データ取得（仮実装）
async function getSettingsData() {
  // TODO: Prismaで実データ取得
  return {
    categories: [
      {
        id: '1',
        name: '建設・リフォーム',
        slug: 'construction',
        description: '住宅・店舗の建設、リフォーム、改装工事',
        displayOrder: 1,
        vendorCount: 120,
        isActive: true,
      },
      {
        id: '2',
        name: '飲食店',
        slug: 'food-service',
        description: 'レストラン、カフェ、居酒屋など',
        displayOrder: 2,
        vendorCount: 85,
        isActive: true,
      },
      {
        id: '3',
        name: '小売・卸売',
        slug: 'retail',
        description: '商品販売、卸売業',
        displayOrder: 3,
        vendorCount: 45,
        isActive: true,
      },
      {
        id: '4',
        name: 'サービス業',
        slug: 'service',
        description: '各種サービス提供業',
        displayOrder: 4,
        vendorCount: 37,
        isActive: true,
      },
      {
        id: '5',
        name: '製造業',
        slug: 'manufacturing',
        description: '製造・加工業',
        displayOrder: 5,
        vendorCount: 0,
        isActive: false,
      },
    ],
    pricing: {
      standardPlan: {
        name: 'スタンダードプラン',
        monthlyFee: 120000,
        features: [
          'プロフィール掲載',
          'Instagram連携',
          '無制限の問い合わせ受信',
          'サービスメニュー登録',
          '優先表示',
        ],
        maxVendors: 300,
      },
      systemConfig: {
        platformFeeRate: 0, // 現在は月額固定のみ
        maxPhotosPerVendor: 20,
        inquiryExpirationDays: 30,
        cartExpirationDays: 7,
      },
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

export default async function SettingsPage() {
  const data = await getSettingsData();

  return (
    <div className="p-8 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">システム設定</h1>
          <p className="text-gray-500 mt-1">
            カテゴリ・料金プランなどの基本設定
          </p>
        </div>
      </div>

      {/* タブコンテンツ */}
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">カテゴリ管理</TabsTrigger>
          <TabsTrigger value="pricing">料金設定</TabsTrigger>
          <TabsTrigger value="system">システム設定</TabsTrigger>
        </TabsList>

        {/* カテゴリ管理 */}
        <TabsContent value="categories" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  業種カテゴリ
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  業者が選択できるカテゴリを管理
                </p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                カテゴリを追加
              </Button>
            </div>

            <div className="space-y-3">
              {data.categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">
                        #{category.displayOrder}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {category.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-xs text-gray-600"
                        >
                          {category.slug}
                        </Badge>
                        {category.isActive ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            公開中
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                            非公開
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        登録業者数: {category.vendorCount}社
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      disabled={category.vendorCount > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">カテゴリ削除について</p>
                  <p>
                    業者が登録されているカテゴリは削除できません。業者を別カテゴリに移動してから削除してください。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 料金設定 */}
        <TabsContent value="pricing" className="space-y-6">
          {/* スタンダードプラン */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {data.pricing.standardPlan.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  業者向け月額サブスクリプション
                </p>
              </div>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                編集
              </Button>
            </div>

            <div className="space-y-6">
              {/* 月額料金 */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  月額料金
                </label>
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatCurrency(data.pricing.standardPlan.monthlyFee)}
                    </span>
                    <span className="text-gray-500">/ 月</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    全ての業者が一律でこの料金を支払います
                  </p>
                </div>
              </div>

              {/* 提供機能 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  提供機能
                </label>
                <div className="space-y-2">
                  {data.pricing.standardPlan.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 最大登録数 */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  最大登録業者数
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    type="number"
                    value={data.pricing.standardPlan.maxVendors}
                    className="w-32"
                    disabled
                  />
                  <span className="text-sm text-gray-600">社まで</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  ※ この値を変更すると、プラットフォーム全体に影響します
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">料金変更の注意</p>
                    <p>
                      料金を変更すると、次回請求分から新料金が適用されます。既存の業者には事前に通知してください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 月次売上シミュレーション */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              売上シミュレーション
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  現在の月次売上（MRR）
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(287 * data.pricing.standardPlan.monthlyFee)}
                </p>
                <p className="text-xs text-gray-500 mt-1">287社 × 12万円</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  最大月次売上（フル稼働時）
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  {formatCurrency(300 * data.pricing.standardPlan.monthlyFee)}
                </p>
                <p className="text-xs text-gray-500 mt-1">300社 × 12万円</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  年間予想売上（ARR）
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {formatCurrency(
                    287 * data.pricing.standardPlan.monthlyFee * 12
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">MRR × 12ヶ月</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* システム設定 */}
        <TabsContent value="system" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  基本設定
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  プラットフォーム全体の動作設定
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* 写真枚数制限 */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  業者あたりの最大写真登録数
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    type="number"
                    value={data.pricing.systemConfig.maxPhotosPerVendor}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">枚まで</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  業者がギャラリーに登録できる写真の上限数
                </p>
              </div>

              {/* 問い合わせ保持期間 */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  問い合わせ保持期間
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    type="number"
                    value={data.pricing.systemConfig.inquiryExpirationDays}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">日間</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  未対応の問い合わせを自動クローズするまでの期間
                </p>
              </div>

              {/* カート保持期間 */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  カート保持期間
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    type="number"
                    value={data.pricing.systemConfig.cartExpirationDays}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">日間</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  ゲストユーザーのカートを保持する期間
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button>
                <Save className="w-4 h-4 mr-2" />
                変更を保存
              </Button>
            </div>
          </Card>

          {/* 危険な操作 */}
          <Card className="p-6 border-red-200">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-red-600">危険な操作</h3>
              <p className="text-sm text-gray-500 mt-1">
                以下の操作は慎重に実行してください
              </p>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                全ての期限切れカートを削除
              </Button>
              <Button variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                全ての未対応問い合わせをクローズ
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
