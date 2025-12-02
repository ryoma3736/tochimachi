'use client';

import { TrendingUp } from 'lucide-react';

interface PriceRange {
  category: string;
  icon: string;
  description: string;
  minPrice: string;
  maxPrice: string;
  note: string;
  popular?: boolean;
}

const priceRanges: PriceRange[] = [
  {
    category: 'リフォーム',
    icon: '🏠',
    description: '水回り・内装・外装',
    minPrice: '10万円',
    maxPrice: '500万円',
    note: '規模により変動',
    popular: true,
  },
  {
    category: '新築',
    icon: '🏗️',
    description: '注文住宅・建売',
    minPrice: '2,000万円',
    maxPrice: '5,000万円',
    note: '土地代別',
    popular: true,
  },
  {
    category: '塗装',
    icon: '🎨',
    description: '外壁・屋根塗装',
    minPrice: '50万円',
    maxPrice: '200万円',
    note: '建物の大きさによる',
  },
  {
    category: '外構',
    icon: '🌳',
    description: 'エクステリア・庭',
    minPrice: '30万円',
    maxPrice: '300万円',
    note: '施工範囲による',
  },
  {
    category: '飲食店改装',
    icon: '🍽️',
    description: '店舗リノベーション',
    minPrice: '100万円',
    maxPrice: '1,000万円',
    note: '面積・内容による',
  },
  {
    category: 'オフィス改装',
    icon: '💼',
    description: '事務所・店舗内装',
    minPrice: '50万円',
    maxPrice: '500万円',
    note: '坪単価10〜30万円',
  },
];

function PriceCard({ priceRange }: { priceRange: PriceRange }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border-2 bg-white p-6 transition-all duration-300 hover:shadow-xl ${
        priceRange.popular
          ? 'border-orange-400 shadow-md'
          : 'border-gray-200 hover:border-orange-400'
      }`}
    >
      {/* Popular Badge */}
      {priceRange.popular && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white">
          <TrendingUp className="h-3 w-3" />
          人気
        </div>
      )}

      {/* Icon */}
      <div className="mb-4 text-5xl transition-transform group-hover:scale-110">
        {priceRange.icon}
      </div>

      {/* Category */}
      <h3 className="mb-2 text-xl font-bold text-gray-900">{priceRange.category}</h3>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-600">{priceRange.description}</p>

      {/* Price Range */}
      <div className="mb-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <div className="mb-1 text-xs font-semibold text-gray-600">相場</div>
        <div className="text-2xl font-bold text-orange-600">
          {priceRange.minPrice}
          <span className="mx-2 text-gray-400">〜</span>
          {priceRange.maxPrice}
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-gray-500">
        <span className="font-semibold">※</span> {priceRange.note}
      </p>

      {/* Hover Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

export function PricingSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            料金相場の目安
          </h2>
          <p className="text-lg text-gray-600">業種別の一般的な価格帯をご紹介します</p>
          <p className="mt-2 text-sm text-gray-500">
            ※あくまで目安です。詳細は各業者へお問い合わせください。
          </p>
        </div>

        {/* Price Cards Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {priceRanges.map((priceRange) => (
            <PriceCard key={priceRange.category} priceRange={priceRange} />
          ))}
        </div>

        {/* Info Box */}
        <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-8">
          <div className="text-center">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              💡 見積もりは複数の業者から取ることをおすすめします
            </h3>
            <p className="mb-6 text-gray-700">
              同じ工事内容でも、業者によって価格や提案内容が異なります。
              <br />
              とちまちなら、複数業者への一括問い合わせが簡単にできます。
            </p>
            <a
              href="/search"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-all hover:bg-orange-700 hover:shadow-lg"
            >
              今すぐ見積もりを依頼する
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
