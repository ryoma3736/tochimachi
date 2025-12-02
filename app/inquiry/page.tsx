/**
 * 問い合わせフォームページ
 *
 * カートに追加した業者への一括問い合わせを受け付ける
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cart-store';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';

/**
 * 問い合わせフォームの型定義
 */
export interface InquiryFormData {
  // お客様情報
  customerName: string;
  customerNameKana: string;
  email: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;

  // 問い合わせ内容
  preferredDate: string;
  preferredTime: string;
  contactMethod: 'email' | 'phone' | 'both';
  message: string;
}

export default function InquiryPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // フォームデータ
  const [formData, setFormData] = useState<InquiryFormData>({
    customerName: '',
    customerNameKana: '',
    email: '',
    phone: '',
    postalCode: '',
    prefecture: '栃木県',
    city: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    contactMethod: 'both',
    message: '',
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // カートが空の場合はトップページにリダイレクト
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/');
    }
  }, [mounted, items, router]);

  /**
   * 入力フィールド変更ハンドラー
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // エラークリア
    if (errors[name as keyof InquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * フォームバリデーション
   */
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InquiryFormData, string>> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'お名前を入力してください';
    }
    if (!formData.customerNameKana.trim()) {
      newErrors.customerNameKana = 'フリガナを入力してください';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号を入力してください';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '有効な電話番号を入力してください';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = '郵便番号を入力してください';
    }
    if (!formData.city.trim()) {
      newErrors.city = '市区町村を入力してください';
    }
    if (!formData.address.trim()) {
      newErrors.address = '番地を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 確認画面へ進む
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // sessionStorageに保存して確認画面へ
    sessionStorage.setItem('inquiryFormData', JSON.stringify(formData));
    router.push('/inquiry/confirm');
  };

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <Container>
        {/* ヘッダー */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            戻る
          </button>
          <h1 className="text-3xl font-bold text-foreground">お問い合わせ情報入力</h1>
          <p className="mt-2 text-muted-foreground">
            選択した{items.length}件の業者に一括で問い合わせを送信します
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* フォーム */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* お客様情報 */}
              <section className="rounded-lg border bg-card p-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">お客様情報</h2>

                <div className="space-y-4">
                  {/* お名前 */}
                  <div>
                    <label htmlFor="customerName" className="mb-1 block text-sm font-medium">
                      お名前 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="山田 太郎"
                      className={errors.customerName ? 'border-destructive' : ''}
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-sm text-destructive">{errors.customerName}</p>
                    )}
                  </div>

                  {/* フリガナ */}
                  <div>
                    <label htmlFor="customerNameKana" className="mb-1 block text-sm font-medium">
                      フリガナ <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="customerNameKana"
                      name="customerNameKana"
                      value={formData.customerNameKana}
                      onChange={handleChange}
                      placeholder="ヤマダ タロウ"
                      className={errors.customerNameKana ? 'border-destructive' : ''}
                    />
                    {errors.customerNameKana && (
                      <p className="mt-1 text-sm text-destructive">{errors.customerNameKana}</p>
                    )}
                  </div>

                  {/* メールアドレス */}
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium">
                      メールアドレス <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                  </div>

                  {/* 電話番号 */}
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                      電話番号 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09012345678"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  {/* 郵便番号 */}
                  <div>
                    <label htmlFor="postalCode" className="mb-1 block text-sm font-medium">
                      郵便番号 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="320-0000"
                      className={errors.postalCode ? 'border-destructive' : ''}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-destructive">{errors.postalCode}</p>
                    )}
                  </div>

                  {/* 都道府県 */}
                  <div>
                    <label htmlFor="prefecture" className="mb-1 block text-sm font-medium">
                      都道府県 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="prefecture"
                      name="prefecture"
                      value={formData.prefecture}
                      onChange={handleChange}
                      disabled
                    />
                  </div>

                  {/* 市区町村 */}
                  <div>
                    <label htmlFor="city" className="mb-1 block text-sm font-medium">
                      市区町村 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="宇都宮市"
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city}</p>}
                  </div>

                  {/* 番地 */}
                  <div>
                    <label htmlFor="address" className="mb-1 block text-sm font-medium">
                      番地・建物名 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="〇〇町1-2-3 〇〇マンション101"
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-destructive">{errors.address}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* 問い合わせ内容 */}
              <section className="rounded-lg border bg-card p-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">問い合わせ内容</h2>

                <div className="space-y-4">
                  {/* 希望日時 */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="preferredDate" className="mb-1 block text-sm font-medium">
                        希望日
                      </label>
                      <Input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className="mb-1 block text-sm font-medium">
                        希望時間帯
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">選択してください</option>
                        <option value="morning">午前（9:00-12:00）</option>
                        <option value="afternoon">午後（13:00-17:00）</option>
                        <option value="evening">夕方以降（17:00-）</option>
                      </select>
                    </div>
                  </div>

                  {/* 連絡方法 */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      希望連絡方法 <span className="text-destructive">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="email"
                          checked={formData.contactMethod === 'email'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-sm">メール</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="phone"
                          checked={formData.contactMethod === 'phone'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-sm">電話</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="both"
                          checked={formData.contactMethod === 'both'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-sm">どちらでも可</span>
                      </label>
                    </div>
                  </div>

                  {/* ご要望・備考 */}
                  <div>
                    <label htmlFor="message" className="mb-1 block text-sm font-medium">
                      ご要望・備考
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="ご要望や質問などがあればご記入ください"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </section>

              {/* 送信ボタン */}
              <div className="flex justify-end">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  確認画面へ進む
                </Button>
              </div>
            </form>
          </div>

          {/* サイドバー（カート内容表示） */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                問い合わせ先（{items.length}件）
              </h3>

              <div className="mb-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-md bg-muted/50 p-3">
                    <p className="font-semibold text-foreground">{item.vendorName}</p>
                    <p className="text-sm text-muted-foreground">{item.serviceName}</p>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {new Intl.NumberFormat('ja-JP', {
                        style: 'currency',
                        currency: 'JPY',
                      }).format(item.estimatedPrice)}
                      〜
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>合計概算</span>
                  <span className="text-primary">
                    {new Intl.NumberFormat('ja-JP', {
                      style: 'currency',
                      currency: 'JPY',
                    }).format(getTotalPrice())}
                    〜
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  ※ 実際の料金は業者との相談で確定します
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
