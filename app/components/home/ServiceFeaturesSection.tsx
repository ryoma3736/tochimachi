'use client';

import { Search, ShoppingCart, Send, Shield, Zap, Instagram } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Search className="h-8 w-8" />,
    title: '1. 業者を探す',
    description: '写真や実績から、あなたのニーズに合った業者を検索。詳細な情報で安心して選べます。',
  },
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: '2. カートに追加',
    description: '気になる業者を複数カートに追加。比較検討しながら、最適な業者を選びましょう。',
  },
  {
    icon: <Send className="h-8 w-8" />,
    title: '3. 一括問い合わせ',
    description: '選んだ業者へまとめて問い合わせ。時間を節約し、効率的に見積もりを依頼できます。',
  },
];

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const benefits: Benefit[] = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: '完全無料',
    description: '登録も利用も一切無料。手数料はかかりません。',
    color: 'bg-blue-500',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: '一括問い合わせ',
    description: '複数業者への問い合わせが一度で完了。',
    color: 'bg-orange-500',
  },
  {
    icon: <Instagram className="h-6 w-6" />,
    title: 'Instagram連携',
    description: '実際の施工例や店内写真をチェック可能。',
    color: 'bg-pink-500',
  },
];

export function ServiceFeaturesSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            3ステップで簡単依頼
          </h2>
          <p className="text-lg text-gray-600">とちまちなら、最適な業者が見つかります</p>
        </div>

        {/* Steps */}
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              {/* Connector Line (Desktop only) */}
              {index < features.length - 1 && (
                <div className="absolute left-full top-16 hidden h-0.5 w-full md:block">
                  <div className="h-full w-full bg-gradient-to-r from-orange-300 to-orange-100" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <svg
                      className="h-4 w-4 text-orange-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Feature Card */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-8 text-center transition-all duration-300 hover:border-orange-600 hover:shadow-xl">
                {/* Background Gradient */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Step Number */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-xl font-bold text-white">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-4 flex justify-center text-orange-600 transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>

                {/* Description */}
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 sm:p-12">
          <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">
            とちまちが選ばれる理由
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
              >
                {/* Icon Circle */}
                <div
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full ${benefit.color} text-white transition-transform group-hover:scale-110`}
                >
                  {benefit.icon}
                </div>

                {/* Title */}
                <h4 className="mb-2 text-lg font-bold text-gray-900">{benefit.title}</h4>

                {/* Description */}
                <p className="text-sm text-gray-600">{benefit.description}</p>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="mb-4 text-lg font-semibold text-gray-900">
              まずは無料で業者を探してみましょう
            </p>
            <a
              href="/search"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-orange-700 hover:shadow-lg"
            >
              無料で業者を探す
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
