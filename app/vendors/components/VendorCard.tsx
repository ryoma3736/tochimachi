'use client';

import Link from 'next/link';
import { MapPin, Instagram, Phone } from 'lucide-react';
import type { VendorListItem } from '@/lib/types/vendor';

interface VendorCardProps {
  vendor: VendorListItem;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  return (
    <Link
      href={`/vendors/${vendor.id}`}
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-orange-600 hover:shadow-xl"
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        {vendor.coverImageUrl ? (
          <img
            src={vendor.coverImageUrl}
            alt={vendor.companyName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100">
            <div className="text-6xl opacity-30">🏢</div>
          </div>
        )}

        {/* Instagram Badge */}
        {vendor.instagramUsername && (
          <div className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-transform group-hover:scale-110">
            <Instagram className="h-4 w-4 text-pink-600" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          {vendor.category.name}
        </div>

        {/* Company Name */}
        <h3 className="mb-3 text-lg font-bold text-gray-900 group-hover:text-orange-600">
          {vendor.companyName}
        </h3>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{vendor.address}</span>
        </div>

        {/* Price Range */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">価格帯:</span>
          <span className="text-sm text-gray-900">
            {formatPrice(vendor.priceRange.min)} 〜 {formatPrice(vendor.priceRange.max)}
          </span>
        </div>

        {/* Service Count */}
        <div className="mb-4 text-sm text-gray-600">{vendor.serviceCount}件のサービス</div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            onClick={(e) => {
              e.preventDefault();
              // Navigate to detail page (handled by Link)
            }}
          >
            詳細を見る
          </button>
          <button
            className="rounded-lg border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50"
            onClick={(e) => {
              e.preventDefault();
              // Handle phone call
              window.location.href = 'tel:0123456789'; // Replace with actual phone number
            }}
          >
            <Phone className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </Link>
  );
}
