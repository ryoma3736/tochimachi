import Link from "next/link";

export default function VendorPendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            登録申請を受け付けました
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            審査完了までしばらくお待ちください
          </p>
        </div>

        <div className="rounded-md bg-blue-50 p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">今後の流れ</h3>
          <ol className="space-y-3 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2 font-semibold">1.</span>
              <span>管理者が登録内容を審査します（通常1-3営業日）</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-semibold">2.</span>
              <span>審査完了後、登録メールアドレス宛に通知が届きます</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-semibold">3.</span>
              <span>通知を受け取ったら、ログインしてプロフィールを完成させてください</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-semibold">4.</span>
              <span>サービスメニューの登録と顧客からの問い合わせ対応が可能になります</span>
            </li>
          </ol>
        </div>

        <div className="rounded-md bg-gray-50 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">お問い合わせ</h3>
          <p className="text-sm text-gray-600 mb-3">
            審査に関するご質問や、登録内容の変更がある場合は、以下までご連絡ください。
          </p>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">メール:</span>{" "}
              <a href="mailto:support@tochimachi.jp" className="text-primary hover:underline">
                support@tochimachi.jp
              </a>
            </div>
            <div>
              <span className="font-medium text-gray-700">電話:</span>{" "}
              <span className="text-gray-900">028-XXX-XXXX</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
