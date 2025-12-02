/**
 * ウェイトリスト登録完了ページ
 * /waitlist/registered
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WaitlistRegisteredPage() {
  const searchParams = useSearchParams();
  const position = searchParams.get('position') || '未定';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-200">
          <CardContent className="pt-12 pb-8">
            <div className="text-center">
              {/* 成功アイコン */}
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                <svg
                  className="h-16 w-16 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* タイトル */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ウェイトリスト登録完了
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                ご登録いただきありがとうございます。
              </p>

              {/* 順位バッジ */}
              <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full mb-8">
                <div className="text-sm font-medium mb-1">現在の順位</div>
                <div className="text-4xl font-bold">第{position}位</div>
              </div>

              {/* 説明セクション */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                <h2 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  今後の流れ
                </h2>
                <ol className="text-sm text-blue-900 space-y-2 list-decimal list-inside">
                  <li>業者登録の枠が空き次第、順番にご案内いたします</li>
                  <li>
                    空き通知メールを受信後、<strong>7日以内</strong>に本登録をお願いいたします
                  </li>
                  <li>登録完了後、審査を経てサービス開始となります</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ご注意事項
                </h2>
                <ul className="text-sm text-yellow-900 space-y-1">
                  <li>• 空き通知メールは受信後7日間有効です</li>
                  <li>• 期限内に登録されない場合、次の順位の方に繰り上げとなります</li>
                  <li>• 順位は前後する場合がございます</li>
                </ul>
              </div>

              {/* メール確認案内 */}
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-4">
                  登録完了メールをお送りしましたので、ご確認ください。
                </p>
                <p className="text-sm text-gray-500">
                  メールが届かない場合は、迷惑メールフォルダをご確認ください。
                </p>
              </div>

              {/* アクションボタン */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    トップページへ
                  </Button>
                </Link>
                <Link href="/vendors">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    業者一覧を見る
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* サポート情報 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>お問い合わせ: support@tochimachi.jp</p>
          <p className="mt-2">とちまち運営事務局</p>
        </div>
      </div>
    </div>
  );
}
