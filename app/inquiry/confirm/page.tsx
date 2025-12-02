/**
 * 問い合わせ確認画面
 *
 * 入力内容を確認し、送信を実行する
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cart-store';
import type { InquiryFormData } from '../page';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

export default function InquiryConfirmPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<InquiryFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // sessionStorageからフォームデータ取得
  useEffect(() => {
    if (mounted) {
      const savedData = sessionStorage.getItem('inquiryFormData');
      if (savedData) {
        setFormData(JSON.parse(savedData));
      } else {
        // データがない場合は入力画面に戻す
        router.push('/inquiry');
      }
    }
  }, [mounted, router]);

  /**
   * 問い合わせ送信処理
   */
  const handleSubmit = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // API送信（実装時はAPIエンドポイントを作成）
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          cartItems: items,
        }),
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }

      // 成功時
      clearCart(); // カートをクリア
      sessionStorage.removeItem('inquiryFormData'); // sessionStorageクリア
      router.push('/inquiry/complete'); // 完了画面へ
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError(
        err instanceof Error ? err.message : '送信に失敗しました。時間をおいて再度お試しください。'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 戻るボタン
   */
  const handleBack = () => {
    router.back();
  };

  if (!mounted || !formData) {
    return null;
  }

  // 連絡方法の表示文字列
  const contactMethodLabel = {
    email: 'メール',
    phone: '電話',
    both: 'どちらでも可',
  }[formData.contactMethod];

  return (
    <div className="min-h-screen bg-background py-12">
      <Container>
        {/* ヘッダー */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            戻る
          </button>
          <h1 className="text-3xl font-bold text-foreground">入力内容の確認</h1>
          <p className="mt-2 text-muted-foreground">以下の内容で問い合わせを送信します</p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* 確認内容 */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* お客様情報 */}
              <section className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">お客様情報</h2>
                <dl className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">お名前</dt>
                    <dd className="col-span-2 text-sm text-foreground">{formData.customerName}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">フリガナ</dt>
                    <dd className="col-span-2 text-sm text-foreground">
                      {formData.customerNameKana}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">メールアドレス</dt>
                    <dd className="col-span-2 text-sm text-foreground">{formData.email}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">電話番号</dt>
                    <dd className="col-span-2 text-sm text-foreground">{formData.phone}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">住所</dt>
                    <dd className="col-span-2 text-sm text-foreground">
                      〒{formData.postalCode}
                      <br />
                      {formData.prefecture}
                      {formData.city}
                      {formData.address}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* 問い合わせ内容 */}
              <section className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">問い合わせ内容</h2>
                <dl className="space-y-3">
                  {formData.preferredDate && (
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">希望日</dt>
                      <dd className="col-span-2 text-sm text-foreground">
                        {formData.preferredDate}
                      </dd>
                    </div>
                  )}
                  {formData.preferredTime && (
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">希望時間帯</dt>
                      <dd className="col-span-2 text-sm text-foreground">
                        {
                          {
                            morning: '午前（9:00-12:00）',
                            afternoon: '午後（13:00-17:00）',
                            evening: '夕方以降（17:00-）',
                          }[formData.preferredTime]
                        }
                      </dd>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-sm font-medium text-muted-foreground">希望連絡方法</dt>
                    <dd className="col-span-2 text-sm text-foreground">{contactMethodLabel}</dd>
                  </div>
                  {formData.message && (
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">ご要望・備考</dt>
                      <dd className="col-span-2 whitespace-pre-wrap text-sm text-foreground">
                        {formData.message}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* 送信先一覧 */}
              <section className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  送信先業者（{items.length}件）
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-md bg-muted/50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{item.vendorName}</p>
                          <p className="text-sm text-muted-foreground">{item.serviceName}</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p>選択サービス: {item.services.join('、')}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-primary">
                          {new Intl.NumberFormat('ja-JP', {
                            style: 'currency',
                            currency: 'JPY',
                          }).format(item.estimatedPrice)}
                          〜
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* アクションボタン */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" size="lg" onClick={handleBack} disabled={isSubmitting}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  入力内容を修正
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      この内容で送信する
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* サイドバー（合計表示） */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">お問い合わせ概要</h3>

              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">業者数</span>
                  <span className="font-medium text-foreground">{items.length}件</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">合計概算</span>
                  <span className="font-medium text-primary">
                    {new Intl.NumberFormat('ja-JP', {
                      style: 'currency',
                      currency: 'JPY',
                    }).format(getTotalPrice())}
                    〜
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <p>・ 選択した全ての業者に一斉送信されます</p>
                <p>・ 各業者から個別に連絡があります</p>
                <p>・ 料金は業者との相談で確定します</p>
                <p>・ 送信後のキャンセルは各業者にご連絡ください</p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
