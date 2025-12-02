'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Save } from 'lucide-react';

export default function VendorProfile() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">プロフィール管理</h1>
          <p className="mt-2 text-gray-600">会社情報とプロフィールを編集できます</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? '保存中...' : '変更を保存'}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">基本情報</TabsTrigger>
          <TabsTrigger value="details">詳細情報</TabsTrigger>
          <TabsTrigger value="images">画像管理</TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="basic">
          <Card>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  会社名 <span className="text-red-500">*</span>
                </label>
                <Input placeholder="株式会社サンプル" defaultValue="株式会社サンプル工務店" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリ <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                    <option>建設・リフォーム</option>
                    <option>飲食店</option>
                    <option>小売</option>
                    <option>サービス業</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <Input type="tel" placeholder="028-123-4567" defaultValue="028-123-4567" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  住所 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="栃木県宇都宮市..."
                  defaultValue="栃木県宇都宮市中央1-1-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ウェブサイトURL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  defaultValue="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  会社説明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[120px]"
                  placeholder="会社の特徴や強みを記載してください..."
                  defaultValue="創業50年の信頼と実績。地域密着型のサービスで、お客様一人ひとりに寄り添った丁寧な対応を心がけています。"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Details */}
        <TabsContent value="details">
          <Card>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  営業時間
                </label>
                <div className="space-y-3">
                  {['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'].map(
                    (day, index) => (
                      <div key={day} className="flex items-center space-x-4">
                        <span className="w-16 text-sm text-gray-700">{day}</span>
                        <Input
                          type="time"
                          defaultValue="09:00"
                          className="w-32"
                        />
                        <span className="text-gray-500">〜</span>
                        <Input
                          type="time"
                          defaultValue={index === 6 ? '' : '18:00'}
                          className="w-32"
                        />
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            defaultChecked={index === 6}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">定休日</span>
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  対応エリア
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    '宇都宮市',
                    '栃木市',
                    '小山市',
                    '足利市',
                    '佐野市',
                    '鹿沼市',
                    '日光市',
                    '那須塩原市',
                    '真岡市',
                  ].map((area) => (
                    <label key={area} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images">
          <Card>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  会社ロゴ
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      ファイルを選択
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">
                      推奨サイズ: 512x512px (JPG, PNG)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カバー画像
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-32 w-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      ファイルを選択
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">
                      推奨サイズ: 1920x600px (JPG, PNG)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ギャラリー画像
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">最大20枚まで追加可能</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
