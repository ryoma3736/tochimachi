'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Inquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'submitted' | 'replied' | 'closed';
  createdAt: string;
  repliedAt?: string;
}

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    customerName: '佐藤 太郎',
    email: 'sato@example.com',
    phone: '090-1234-5678',
    service: '外壁塗装',
    message: '3階建ての一戸建ての外壁塗装を検討しています。見積もりをお願いしたいです。',
    status: 'submitted',
    createdAt: '2025-12-02 14:30',
  },
  {
    id: '2',
    customerName: '鈴木 花子',
    email: 'suzuki@example.com',
    phone: '080-9876-5432',
    service: '屋根修理',
    message: '台風で屋根瓦が数枚ずれてしまいました。至急対応可能でしょうか?',
    status: 'replied',
    createdAt: '2025-12-01 10:15',
    repliedAt: '2025-12-01 11:30',
  },
  {
    id: '3',
    customerName: '田中 一郎',
    email: 'tanaka@example.com',
    phone: '090-1111-2222',
    service: '内装リフォーム',
    message: 'リビングのクロス張替えとフローリング交換を希望しています。',
    status: 'closed',
    createdAt: '2025-11-30 09:00',
    repliedAt: '2025-11-30 15:00',
  },
];

const statusConfig = {
  submitted: { label: '未対応', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  replied: { label: '返信済み', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  closed: { label: '完了', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

export default function VendorInquiries() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredInquiries = mockInquiries.filter((inquiry) => {
    if (activeTab === 'all') return true;
    return inquiry.status === activeTab;
  });

  const counts = {
    all: mockInquiries.length,
    submitted: mockInquiries.filter((i) => i.status === 'submitted').length,
    replied: mockInquiries.filter((i) => i.status === 'replied').length,
    closed: mockInquiries.filter((i) => i.status === 'closed').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">問い合わせ管理</h1>
        <p className="mt-2 text-gray-600">お客様からの問い合わせを確認・対応できます</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">全体</p>
                <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">未対応</p>
                <p className="text-2xl font-bold text-yellow-600">{counts.submitted}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">返信済み</p>
                <p className="text-2xl font-bold text-blue-600">{counts.replied}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">完了</p>
                <p className="text-2xl font-bold text-gray-600">{counts.closed}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">すべて ({counts.all})</TabsTrigger>
          <TabsTrigger value="submitted">未対応 ({counts.submitted})</TabsTrigger>
          <TabsTrigger value="replied">返信済み ({counts.replied})</TabsTrigger>
          <TabsTrigger value="closed">完了 ({counts.closed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredInquiries.length === 0 ? (
            <Card>
              <div className="p-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-500">該当する問い合わせはありません</p>
              </div>
            </Card>
          ) : (
            filteredInquiries.map((inquiry) => {
              const StatusIcon = statusConfig[inquiry.status].icon;
              return (
                <Card key={inquiry.id}>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {inquiry.customerName}
                          </h3>
                          <Badge className={statusConfig[inquiry.status].color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[inquiry.status].label}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>📧 {inquiry.email}</p>
                          <p>📱 {inquiry.phone}</p>
                          <p>
                            🏷️ サービス: <span className="font-medium">{inquiry.service}</span>
                          </p>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">お問い合わせ内容:</p>
                          <p className="mt-1 text-sm text-gray-600">{inquiry.message}</p>
                        </div>
                        <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
                          <span>問い合わせ日時: {inquiry.createdAt}</span>
                          {inquiry.repliedAt && (
                            <span>返信日時: {inquiry.repliedAt}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link href={`/vendor/inquiries/${inquiry.id}`}>
                          <Button>詳細・返信</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
