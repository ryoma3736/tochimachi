/**
 * ウェイトリスト登録ページ
 * /waitlist
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
}

interface CapacityStatus {
  totalCapacity: number;
  currentVendorCount: number;
  availableSlots: number;
  waitlistCount: number;
  isFull: boolean;
}

export default function WaitlistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [capacityStatus, setCapacityStatus] = useState<CapacityStatus | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    categoryId: '',
    message: '',
  });

  // カテゴリ一覧取得
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/vendors');
        if (response.ok) {
          const data = await response.json();
          // TODO: categories APIエンドポイントを作成
          // 暫定的にvendors APIから推測
          setCategories([
            { id: '1', name: '建設・リフォーム' },
            { id: '2', name: '飲食店' },
            { id: '3', name: '美容・エステ' },
            { id: '4', name: 'その他' },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }

    async function fetchCapacity() {
      try {
        const response = await fetch('/api/admin/capacity');
        if (response.ok) {
          const data = await response.json();
          setCapacityStatus(data);
        }
      } catch (err) {
        console.error('Failed to fetch capacity:', err);
      }
    }

    fetchCategories();
    fetchCapacity();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.redirectTo) {
          // 枠が空いている場合は通常登録へリダイレクト
          router.push(data.redirectTo);
          return;
        }
        throw new Error(data.message || 'ウェイトリスト登録に失敗しました');
      }

      // 登録完了ページへ遷移
      router.push(`/waitlist/registered?position=${data.waitlist.position}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ウェイトリスト登録
          </h1>
          <p className="text-lg text-gray-600">
            現在300社枠が満員です。空き枠が発生次第ご案内いたします。
          </p>
        </div>

        {capacityStatus && (
          <Card className="mb-6 border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg">現在の枠状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    {capacityStatus.currentVendorCount}
                  </div>
                  <div className="text-sm text-gray-600">登録業者数</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {capacityStatus.waitlistCount}
                  </div>
                  <div className="text-sm text-gray-600">ウェイトリスト</div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                最大登録枠: {capacityStatus.totalCapacity}社
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>登録情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="companyName">
                  会社名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  required
                  placeholder="株式会社とちまち"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  メールアドレス <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="info@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <p className="text-sm text-gray-500">
                  空き通知をお送りするメールアドレスです
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">
                  業種 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="業種を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">メッセージ（任意）</Label>
                <Textarea
                  id="message"
                  placeholder="申込理由や事業内容などをご記入ください"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500">
                  {formData.message.length}/500文字
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  ⚠️ 注意事項
                </h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• 空き通知メールは受信後7日間有効です</li>
                  <li>• 期限内に登録されない場合、次の順位の方に繰り上げとなります</li>
                  <li>• 順位は前後する場合がございます</li>
                  <li>• 月額12万円（税込）の課金が発生します</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.categoryId}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                size="lg"
              >
                {loading ? '登録中...' : 'ウェイトリストに登録する'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
