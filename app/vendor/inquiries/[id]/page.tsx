'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function InquiryDetail() {
  const params = useParams();
  const [reply, setReply] = useState('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'submitted' | 'replied' | 'closed'>('submitted');

  // Mock data - 実際はAPIから取得
  const inquiry = {
    id: params.id,
    customerName: '佐藤 太郎',
    email: 'sato@example.com',
    phone: '090-1234-5678',
    service: '外壁塗装',
    message: '3階建ての一戸建ての外壁塗装を検討しています。見積もりをお願いしたいです。',
    status: status,
    createdAt: '2025-12-02 14:30',
  };

  const handleSendReply = () => {
    if (!reply.trim()) return;
    setStatus('replied');
    alert('返信を送信しました');
  };

  const handleClose = () => {
    setStatus('closed');
    alert('問い合わせを完了にしました');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/vendor/inquiries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            問い合わせ一覧に戻る
          </Button>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">問い合わせ詳細</h1>
            <p className="mt-2 text-gray-600">ID: {inquiry.id}</p>
          </div>
          {status === 'replied' && (
            <Button variant="outline" onClick={handleClose}>
              完了にする
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">お客様情報</h2>
                <Badge
                  className={
                    status === 'submitted'
                      ? 'bg-yellow-100 text-yellow-800'
                      : status === 'replied'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }
                >
                  {status === 'submitted'
                    ? '未対応'
                    : status === 'replied'
                      ? '返信済み'
                      : '完了'}
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">お名前</p>
                  <p className="text-base font-medium text-gray-900">{inquiry.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">メールアドレス</p>
                  <p className="text-base text-gray-900">{inquiry.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">電話番号</p>
                  <p className="text-base text-gray-900">{inquiry.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">希望サービス</p>
                  <Badge variant="outline">{inquiry.service}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">問い合わせ日時</p>
                  <p className="text-base text-gray-900">{inquiry.createdAt}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Inquiry Message */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">問い合わせ内容</h2>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            </div>
          </Card>

          {/* Reply Section */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">返信</h2>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[200px]"
                placeholder="お客様への返信メッセージを入力してください..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSendReply} disabled={!reply.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  返信を送信
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Internal Memo */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">内部メモ</h3>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[150px]"
                placeholder="社内共有用のメモ（お客様には表示されません）"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
              <Button variant="outline" size="sm" className="mt-3 w-full">
                <Save className="mr-2 h-4 w-4" />
                メモを保存
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📧 メールで連絡
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📱 電話をかける
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📄 見積書を作成
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
