'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Instagram } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  featured?: boolean;
  instagramUrl?: string;
  tags: string[];
}

// Mock data - 実際にはAPIから取得
const mockBusinesses: Business[] = [
  {
    id: '1',
    name: '栃木リフォーム工房',
    category: 'リフォーム',
    rating: 4.8,
    reviewCount: 127,
    location: '宇都宮市',
    image: '/placeholder-business-1.jpg',
    featured: true,
    instagramUrl: 'https://instagram.com/example',
    tags: ['実績豊富', '相談無料', '即日対応'],
  },
  {
    id: '2',
    name: 'カフェ レモンツリー',
    category: 'カフェ',
    rating: 4.6,
    reviewCount: 89,
    location: '小山市',
    image: '/placeholder-business-2.jpg',
    instagramUrl: 'https://instagram.com/example',
    tags: ['インスタ映え', '駐車場あり'],
  },
  {
    id: '3',
    name: '山田塗装店',
    category: '塗装',
    rating: 4.9,
    reviewCount: 156,
    location: '足利市',
    image: '/placeholder-business-3.jpg',
    featured: true,
    tags: ['創業50年', '保証充実'],
  },
  {
    id: '4',
    name: 'イタリアン ベラヴィータ',
    category: 'レストラン',
    rating: 4.7,
    reviewCount: 203,
    location: '宇都宮市',
    image: '/placeholder-business-4.jpg',
    instagramUrl: 'https://instagram.com/example',
    tags: ['本格イタリアン', '個室あり'],
  },
  {
    id: '5',
    name: 'ナチュラル家具工房',
    category: '家具',
    rating: 4.5,
    reviewCount: 67,
    location: '栃木市',
    image: '/placeholder-business-5.jpg',
    tags: ['オーダーメイド', '無垢材'],
  },
  {
    id: '6',
    name: '佐藤建設',
    category: '新築',
    rating: 4.8,
    reviewCount: 94,
    location: '那須塩原市',
    image: '/placeholder-business-6.jpg',
    featured: true,
    tags: ['注文住宅', '自然素材'],
  },
];

function BusinessCard({ business }: { business: Business }) {
  return (
    <Link
      href={`/business/${business.id}`}
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-orange-600 hover:shadow-xl"
    >
      {/* Featured Badge */}
      {business.featured && (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
          人気
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        {/* Placeholder for actual image */}
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100">
          <div className="text-6xl opacity-30">🏢</div>
        </div>
        {/* Instagram Badge */}
        {business.instagramUrl && (
          <div className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 backdrop-blur-sm">
            <Instagram className="h-4 w-4 text-pink-600" />
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="mb-2 text-sm font-semibold text-orange-600">{business.category}</div>

        {/* Name */}
        <h3 className="mb-3 text-lg font-bold text-gray-900 group-hover:text-orange-600">
          {business.name}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{business.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({business.reviewCount}件のレビュー)</span>
        </div>

        {/* Location */}
        <div className="mb-4 flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{business.location}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {business.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function PopularBusinessesSection() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            人気の業者
          </h2>
          <p className="text-lg text-gray-600">栃木県で評価の高い企業をご紹介</p>
        </div>

        {/* Business Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-orange-600 bg-white px-8 py-4 text-lg font-semibold text-orange-600 transition-all hover:bg-orange-600 hover:text-white"
          >
            もっと見る
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
