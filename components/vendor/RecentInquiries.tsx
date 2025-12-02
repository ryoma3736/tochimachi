import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Inquiry {
  id: string;
  customerName: string;
  service: string;
  status: 'submitted' | 'replied' | 'closed';
  date: string;
}

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    customerName: '佐藤 太郎',
    service: 'リフォーム見積もり',
    status: 'submitted',
    date: '2025-12-02',
  },
  {
    id: '2',
    customerName: '鈴木 花子',
    service: '塗装工事相談',
    status: 'replied',
    date: '2025-12-01',
  },
  {
    id: '3',
    customerName: '田中 一郎',
    service: '外壁修理',
    status: 'closed',
    date: '2025-11-30',
  },
];

const statusMap = {
  submitted: { label: '未対応', color: 'bg-yellow-100 text-yellow-800' },
  replied: { label: '返信済み', color: 'bg-blue-100 text-blue-800' },
  closed: { label: '完了', color: 'bg-gray-100 text-gray-800' },
};

export function RecentInquiries() {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">最近の問い合わせ</h3>
          <Link href="/vendor/inquiries">
            <Button variant="ghost" size="sm">
              すべて表示
            </Button>
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {mockInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <p className="font-medium text-gray-900">{inquiry.customerName}</p>
                  <Badge className={statusMap[inquiry.status].color}>
                    {statusMap[inquiry.status].label}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-600">{inquiry.service}</p>
                <p className="mt-1 text-xs text-gray-500">{inquiry.date}</p>
              </div>
              <Link href={`/vendor/inquiries/${inquiry.id}`}>
                <Button variant="outline" size="sm">
                  詳細
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
