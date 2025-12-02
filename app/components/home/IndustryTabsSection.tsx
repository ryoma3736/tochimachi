'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Utensils, ShoppingBag } from 'lucide-react';

interface SubCategory {
  name: string;
  href: string;
  icon?: string;
}

interface IndustryTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  subCategories: SubCategory[];
}

const industries: IndustryTab[] = [
  {
    id: 'construction',
    name: '建設業',
    icon: <Building2 className="h-6 w-6" />,
    description: '住宅・建設関連のプロフェッショナル',
    subCategories: [
      { name: 'リフォーム', href: '/search?category=reform', icon: '🏠' },
      { name: '新築', href: '/search?category=new-construction', icon: '🏗️' },
      { name: '外構', href: '/search?category=exterior', icon: '🌳' },
      { name: '塗装', href: '/search?category=painting', icon: '🎨' },
      { name: '解体', href: '/search?category=demolition', icon: '⚒️' },
      { name: '内装', href: '/search?category=interior', icon: '🛋️' },
    ],
  },
  {
    id: 'restaurant',
    name: '飲食業',
    icon: <Utensils className="h-6 w-6" />,
    description: '地域の美味しいお店',
    subCategories: [
      { name: '居酒屋', href: '/search?category=izakaya', icon: '🍻' },
      { name: 'カフェ', href: '/search?category=cafe', icon: '☕' },
      { name: 'レストラン', href: '/search?category=restaurant', icon: '🍽️' },
      { name: 'ラーメン', href: '/search?category=ramen', icon: '🍜' },
      { name: '焼肉', href: '/search?category=yakiniku', icon: '🥩' },
      { name: '和食', href: '/search?category=japanese', icon: '🍱' },
    ],
  },
  {
    id: 'retail',
    name: '小売業',
    icon: <ShoppingBag className="h-6 w-6" />,
    description: '地域密着型の専門店',
    subCategories: [
      { name: '家具', href: '/search?category=furniture', icon: '🪑' },
      { name: '衣料', href: '/search?category=clothing', icon: '👔' },
      { name: '食品', href: '/search?category=food', icon: '🍎' },
      { name: '雑貨', href: '/search?category=general-goods', icon: '🎁' },
      { name: '電化製品', href: '/search?category=electronics', icon: '📱' },
      { name: '書籍', href: '/search?category=books', icon: '📚' },
    ],
  },
];

export function IndustryTabsSection() {
  const [activeTab, setActiveTab] = useState('construction');

  const currentIndustry = industries.find((ind) => ind.id === activeTab);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            業種から探す
          </h2>
          <p className="text-lg text-gray-600">あなたの目的に合った業種をお選びください</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
          {industries.map((industry) => (
            <button
              key={industry.id}
              onClick={() => setActiveTab(industry.id)}
              className={`group relative flex items-center gap-3 rounded-lg px-6 py-4 text-left font-semibold transition-all duration-300 ${
                activeTab === industry.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span
                className={`transition-transform group-hover:scale-110 ${
                  activeTab === industry.id ? 'text-white' : 'text-orange-600'
                }`}
              >
                {industry.icon}
              </span>
              <div>
                <div className="text-lg">{industry.name}</div>
                <div
                  className={`text-xs ${
                    activeTab === industry.id ? 'text-orange-100' : 'text-gray-500'
                  }`}
                >
                  {industry.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content - Sub Categories Grid */}
        {currentIndustry && (
          <div className="duration-500 animate-in fade-in">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {currentIndustry.subCategories.map((subCat) => (
                <Link
                  key={subCat.name}
                  href={subCat.href}
                  className="group relative overflow-hidden rounded-lg border-2 border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:border-orange-600 hover:shadow-lg"
                >
                  {/* Icon */}
                  <div className="mb-3 text-4xl transition-transform group-hover:scale-110">
                    {subCat.icon}
                  </div>

                  {/* Name */}
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-orange-600">
                    {subCat.name}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-8 text-center">
              <Link
                href={`/search?industry=${activeTab}`}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
              >
                {currentIndustry.name}の業者をすべて見る
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
