import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ClipboardList,
  Search,
  Mail,
  Phone,
  Calendar,
  ArrowUpCircle,
  Clock,
  CheckCircle,
  Users,
} from 'lucide-react';

// ウェイトリストデータ取得（仮実装）
async function getWaitlistData() {
  // TODO: Prismaで実データ取得
  return {
    summary: {
      totalWaiting: 45,
      avgWaitTime: 23, // 日数
      promotedThisMonth: 8,
      availableSlots: 13, // 300 - 287
    },
    waitlist: [
      {
        id: '1',
        companyName: '栃木工業株式会社',
        email: 'tochigi-kogyo@example.com',
        phone: '028-111-2222',
        category: '建設・リフォーム',
        registeredAt: '2025-10-15T10:00:00Z',
        waitingDays: 48,
        status: 'WAITING',
        notes: '大手企業。優先度高',
      },
      {
        id: '2',
        companyName: '宇都宮飲食チェーン',
        email: 'utsunomiya-food@example.com',
        phone: '028-333-4444',
        category: '飲食店',
        registeredAt: '2025-10-20T14:30:00Z',
        waitingDays: 43,
        status: 'WAITING',
        notes: '複数店舗展開予定',
      },
      {
        id: '3',
        companyName: '足利リフォーム',
        email: 'ashikaga-reform@example.com',
        phone: '028-555-6666',
        category: '建設・リフォーム',
        registeredAt: '2025-10-25T09:15:00Z',
        waitingDays: 38,
        status: 'WAITING',
        notes: '',
      },
      {
        id: '4',
        companyName: '栃木小売グループ',
        email: 'tochigi-retail@example.com',
        phone: '028-777-8888',
        category: '小売・卸売',
        registeredAt: '2025-11-01T11:45:00Z',
        waitingDays: 31,
        status: 'WAITING',
        notes: '',
      },
      {
        id: '5',
        companyName: '日光観光サービス',
        email: 'nikko-tour@example.com',
        phone: '028-999-0000',
        category: 'サービス業',
        registeredAt: '2025-11-10T16:20:00Z',
        waitingDays: 22,
        status: 'WAITING',
        notes: '観光業。季節需要あり',
      },
    ],
    recentPromotions: [
      {
        id: '1',
        companyName: '山田工務店',
        promotedAt: '2025-11-28T10:00:00Z',
        assignedSlot: 287,
      },
      {
        id: '2',
        companyName: '田中建設',
        promotedAt: '2025-11-20T15:30:00Z',
        assignedSlot: 286,
      },
    ],
  };
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

export default async function WaitlistPage() {
  const data = await getWaitlistData();

  return (
    <div className="p-8 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ウェイトリスト管理
          </h1>
          <p className="text-gray-500 mt-1">
            300社枠の空き待ち業者を管理・繰り上げ処理
          </p>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 待機中の業者数 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">待機中</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {data.summary.totalWaiting}
              </h3>
              <p className="text-sm text-gray-500 mt-2">社</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        {/* 平均待機日数 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">平均待機日数</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {data.summary.avgWaitTime}
              </h3>
              <p className="text-sm text-gray-500 mt-2">日</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* 今月の繰り上げ数 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                今月の繰り上げ
              </p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {data.summary.promotedThisMonth}
              </h3>
              <p className="text-sm text-gray-500 mt-2">社</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* 利用可能枠数 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">利用可能枠</p>
              <h3 className="text-3xl font-bold text-purple-600 mt-2">
                {data.summary.availableSlots}
              </h3>
              <p className="text-sm text-gray-500 mt-2">/ 300 枠</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* 検索 */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="会社名・メールアドレスで検索"
            className="pl-10"
          />
        </div>
      </Card>

      {/* ウェイトリスト一覧 */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            登録順リスト（早い順）
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            解約発生時は上から順に繰り上げ処理を行ってください
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  順番
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  会社名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  連絡先
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  登録日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  待機日数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  備考
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.waitlist.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        #{index + 1}
                      </span>
                      {index === 0 && (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                          最優先
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.companyName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{item.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{item.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(item.registeredAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-semibold ${
                        item.waitingDays > 40
                          ? 'text-red-600'
                          : item.waitingDays > 30
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                      }`}
                    >
                      {item.waitingDays}日
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {item.notes || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      size="sm"
                      disabled={data.summary.availableSlots === 0}
                    >
                      <ArrowUpCircle className="w-4 h-4 mr-1" />
                      繰り上げ
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 最近の繰り上げ履歴 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          最近の繰り上げ履歴
        </h3>
        <div className="space-y-3">
          {data.recentPromotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {promotion.companyName}
                  </p>
                  <p className="text-sm text-gray-600">
                    表示順 #{promotion.assignedSlot} に割り当て
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(promotion.promotedAt)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
