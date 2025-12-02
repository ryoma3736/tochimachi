'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  ShoppingCart,
  Mail,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { InstagramGallery } from './components/InstagramGallery';
import type { VendorDetail, Service, InstagramPost } from '@/lib/types/vendor';

// Mock data - replace with actual API call
const getMockVendorDetail = (id: string): VendorDetail => ({
  id,
  companyName: '栃木リフォーム工房',
  categoryId: '1',
  isActive: true,
  displayOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: {
    id: '1',
    name: 'リフォーム',
    slug: 'reform',
    displayOrder: 1,
  },
  profile: {
    id: 'profile-1',
    vendorId: id,
    description: `栃木県を中心に、お客様の理想の住まいづくりをお手伝いしています。
創業20年の実績と信頼で、リフォームのご相談から施工、アフターフォローまで一貫してサポートいたします。

【当社の強み】
・豊富な施工実績（年間200件以上）
・経験豊富な職人による丁寧な施工
・明確な料金体系と詳細なお見積もり
・充実のアフター保証（最長10年）

お客様のご要望を丁寧にヒアリングし、最適なプランをご提案いたします。
まずはお気軽にご相談ください。`,
    logoUrl: '/placeholder-logo.png',
    coverImageUrl: '/placeholder-cover.jpg',
    businessHours: {
      mon: '9:00-18:00',
      tue: '9:00-18:00',
      wed: '9:00-18:00',
      thu: '9:00-18:00',
      fri: '9:00-18:00',
      sat: '9:00-17:00',
      sun: '定休日',
    },
    address: '栃木県宇都宮市本町1-1-1',
    mapUrl: 'https://maps.google.com',
    websiteUrl: 'https://example.com',
    contactPhone: '028-123-4567',
    gallery: ['/gallery1.jpg', '/gallery2.jpg', '/gallery3.jpg'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  services: [
    {
      id: 's1',
      vendorId: id,
      name: 'キッチンリフォーム',
      description: 'システムキッチンの交換・リフォーム。最新設備で快適なキッチン空間を実現します。',
      price: 500000,
      unit: '1式',
      duration: 240,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 's2',
      vendorId: id,
      name: '浴室リフォーム',
      description: 'ユニットバスの交換・リフォーム。断熱性能向上で快適なバスタイムを。',
      price: 800000,
      unit: '1式',
      duration: 360,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 's3',
      vendorId: id,
      name: 'トイレリフォーム',
      description: '最新の節水トイレへの交換。快適性と経済性を両立します。',
      price: 200000,
      unit: '1式',
      duration: 120,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 's4',
      vendorId: id,
      name: '外壁塗装',
      description: '外壁の塗り替え。耐久性の高い塗料を使用し、美観と保護性能を向上。',
      price: 1200000,
      unit: '1式',
      duration: 720,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  instagramAccount: {
    id: 'ig1',
    vendorId: id,
    instagramUsername: 'tochigi_reform',
    lastSyncAt: new Date(),
    isActive: true,
    posts: [
      {
        id: 'post1',
        caption: 'キッチンリフォーム完成しました！明るく使いやすい空間になりました✨',
        mediaUrl: '/placeholder-ig1.jpg',
        mediaType: 'IMAGE',
        permalink: 'https://instagram.com/p/example1',
        timestamp: new Date().toISOString(),
        likeCount: 245,
      },
      {
        id: 'post2',
        caption: '浴室リフォームビフォーアフター🛁',
        mediaUrl: '/placeholder-ig2.jpg',
        mediaType: 'CAROUSEL_ALBUM',
        permalink: 'https://instagram.com/p/example2',
        timestamp: new Date().toISOString(),
        likeCount: 189,
      },
      {
        id: 'post3',
        caption: '外壁塗装の施工中です',
        mediaUrl: '/placeholder-ig3.jpg',
        mediaType: 'IMAGE',
        permalink: 'https://instagram.com/p/example3',
        timestamp: new Date().toISOString(),
        likeCount: 156,
      },
      {
        id: 'post4',
        caption: 'トイレリフォーム完成🚽最新の節水トイレで快適に',
        mediaUrl: '/placeholder-ig4.jpg',
        mediaType: 'IMAGE',
        permalink: 'https://instagram.com/p/example4',
        timestamp: new Date().toISOString(),
        likeCount: 203,
      },
      {
        id: 'post5',
        caption: 'リビングリフォームのご相談承ります',
        mediaUrl: '/placeholder-ig5.jpg',
        mediaType: 'IMAGE',
        permalink: 'https://instagram.com/p/example5',
        timestamp: new Date().toISOString(),
        likeCount: 167,
      },
      {
        id: 'post6',
        caption: '無料見積もり実施中！お気軽にお問い合わせください',
        mediaUrl: '/placeholder-ig6.jpg',
        mediaType: 'VIDEO',
        permalink: 'https://instagram.com/p/example6',
        timestamp: new Date().toISOString(),
        likeCount: 134,
      },
    ],
  },
});

export default function VendorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    // In real implementation, fetch from API
    // Example: getVendorById(id)
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setVendor(getMockVendorDetail(id));
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = (service: Service) => {
    // In real implementation, call addToCart API
    alert(`「${service.name}」をカートに追加しました`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  const getDayName = (key: string) => {
    const days: Record<string, string> = {
      mon: '月',
      tue: '火',
      wed: '水',
      thu: '木',
      fri: '金',
      sat: '土',
      sun: '日',
    };
    return days[key] || key;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">業者が見つかりませんでした</h1>
          <Link
            href="/vendors"
            className="text-orange-600 hover:text-orange-700 hover:underline"
          >
            業者一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            業者一覧に戻る
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 bg-gray-200 sm:h-80">
        {vendor.profile.coverImageUrl ? (
          <img
            src={vendor.profile.coverImageUrl}
            alt={vendor.companyName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100">
            <div className="text-8xl opacity-30">🏢</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Company Info */}
            <div className="flex-1">
              <div className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                {vendor.category.name}
              </div>
              <h1 className="mb-4 text-3xl font-bold text-gray-900">{vendor.companyName}</h1>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{vendor.profile.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <a
                    href={`tel:${vendor.profile.contactPhone}`}
                    className="hover:text-orange-600"
                  >
                    {vendor.profile.contactPhone}
                  </a>
                </div>
                {vendor.profile.websiteUrl && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <a
                      href={vendor.profile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-orange-600"
                    >
                      ホームページ
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:w-64">
              <a
                href={`tel:${vendor.profile.contactPhone}`}
                className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700"
              >
                <Phone className="h-5 w-5" />
                電話で問い合わせ
              </a>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                <Mail className="h-5 w-5" />
                メールで問い合わせ
              </button>
            </div>
          </div>

          {/* Business Hours */}
          {vendor.profile.businessHours && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex items-start gap-2">
                <Clock className="mt-1 h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">営業時間</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
                    {Object.entries(vendor.profile.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex gap-2">
                        <span className="font-medium text-gray-700">{getDayName(day)}:</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instagram Gallery */}
        {vendor.instagramAccount && vendor.instagramAccount.posts && (
          <div className="mb-8">
            <InstagramGallery
              username={vendor.instagramAccount.instagramUsername}
              posts={vendor.instagramAccount.posts}
            />
          </div>
        )}

        {/* Services */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">サービス・料金</h2>

          <div className="space-y-4">
            {vendor.services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-orange-300 hover:bg-orange-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{service.name}</h3>
                  {service.description && (
                    <p className="mb-2 text-sm text-gray-600">{service.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">料金:</span>
                      <span className="text-orange-600">{formatPrice(service.price)}</span>
                      <span className="text-gray-600">/ {service.unit}</span>
                    </div>
                    {service.duration && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700">目安時間:</span>
                        <span className="text-gray-600">{Math.floor(service.duration / 60)}時間</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(service)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700 sm:w-auto"
                >
                  <ShoppingCart className="h-5 w-5" />
                  カートに追加
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Company Description */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">会社概要</h2>
          {vendor.profile.description && (
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">
              {vendor.profile.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
