/**
 * 問い合わせ完了画面
 *
 * 送信完了を通知し、次のアクションを案内する
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, Mail, Phone } from 'lucide-react';

export default function InquiryCompletePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * トップページに戻る
   */
  const handleGoHome = () => {
    router.push('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <Container>
        <div className="mx-auto max-w-2xl">
          {/* 成功アイコン */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
          </div>

          {/* メインメッセージ */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">
              お問い合わせを受け付けました
            </h1>
            <p className="text-lg text-muted-foreground">
              選択した業者へ一括で問い合わせを送信しました。
              <br />
              各業者から個別に連絡がありますので、しばらくお待ちください。
            </p>
          </div>

          {/* 次のステップ */}
          <div className="mb-8 rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">今後の流れ</h2>
            <ol className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">確認メール送信</p>
                  <p className="text-sm text-muted-foreground">
                    ご登録のメールアドレスに確認メールが送信されます
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">業者からの連絡</p>
                  <p className="text-sm text-muted-foreground">
                    通常1〜3営業日以内に各業者から個別に連絡があります
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">詳細打ち合わせ</p>
                  <p className="text-sm text-muted-foreground">
                    各業者と詳細な内容や料金について相談してください
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  4
                </div>
                <div>
                  <p className="font-medium text-foreground">契約・サービス開始</p>
                  <p className="text-sm text-muted-foreground">
                    ご希望の業者と契約を結び、サービスを開始します
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* 注意事項 */}
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30">
            <h3 className="mb-3 text-lg font-semibold text-foreground">ご注意事項</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  業者からの連絡がない場合は、迷惑メールフォルダをご確認ください
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  土日祝日を挟む場合、連絡までに時間がかかる場合があります
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  実際の料金やサービス内容は、業者との直接相談で確定します
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  キャンセルや変更がある場合は、各業者に直接ご連絡ください
                </span>
              </li>
            </ul>
          </div>

          {/* お問い合わせ情報 */}
          <div className="mb-8 rounded-lg border bg-muted/50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              とちまち サポート窓口
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              ご不明な点がございましたら、お気軽にお問い合わせください。
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">support@tochimachi.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">028-XXX-XXXX（平日 9:00-18:00）</span>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-center">
            <Button onClick={handleGoHome} size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              トップページに戻る
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
