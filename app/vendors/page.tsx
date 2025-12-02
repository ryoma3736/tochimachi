'use client';

import { useState, useEffect } from 'react';
import { VendorCard } from './components/VendorCard';
import { VendorFilters } from './components/VendorFilters';
import { VendorSort } from './components/VendorSort';
import { Pagination } from './components/Pagination';
import type {
  VendorListItem,
  Category,
  VendorFilters as VendorFiltersType,
  VendorSortBy,
} from '@/lib/types/vendor';

// Mock data - replace with actual API calls
const mockCategories: Category[] = [
  { id: '1', name: 'リフォーム', slug: 'reform', displayOrder: 1 },
  { id: '2', name: '塗装', slug: 'painting', displayOrder: 2 },
  { id: '3', name: '新築', slug: 'new-construction', displayOrder: 3 },
  { id: '4', name: 'カフェ', slug: 'cafe', displayOrder: 4 },
  { id: '5', name: 'レストラン', slug: 'restaurant', displayOrder: 5 },
  { id: '6', name: '家具', slug: 'furniture', displayOrder: 6 },
];

const mockAreas = ['宇都宮市', '小山市', '足利市', '栃木市', '那須塩原市', '佐野市'];

const mockVendors: VendorListItem[] = [
  {
    id: '1',
    companyName: '栃木リフォーム工房',
    category: { name: 'リフォーム', slug: 'reform' },
    coverImageUrl: '/placeholder-business-1.jpg',
    priceRange: { min: 50000, max: 500000 },
    address: '宇都宮市',
    instagramUsername: 'tochigi_reform',
    serviceCount: 12,
  },
  {
    id: '2',
    companyName: 'カフェ レモンツリー',
    category: { name: 'カフェ', slug: 'cafe' },
    coverImageUrl: '/placeholder-business-2.jpg',
    priceRange: { min: 800, max: 2000 },
    address: '小山市',
    instagramUsername: 'cafe_lemontree',
    serviceCount: 8,
  },
  {
    id: '3',
    companyName: '山田塗装店',
    category: { name: '塗装', slug: 'painting' },
    coverImageUrl: '/placeholder-business-3.jpg',
    priceRange: { min: 100000, max: 800000 },
    address: '足利市',
    serviceCount: 15,
  },
  {
    id: '4',
    companyName: 'イタリアン ベラヴィータ',
    category: { name: 'レストラン', slug: 'restaurant' },
    coverImageUrl: '/placeholder-business-4.jpg',
    priceRange: { min: 2000, max: 8000 },
    address: '宇都宮市',
    instagramUsername: 'bellavita_utsunomiya',
    serviceCount: 6,
  },
  {
    id: '5',
    companyName: 'ナチュラル家具工房',
    category: { name: '家具', slug: 'furniture' },
    coverImageUrl: '/placeholder-business-5.jpg',
    priceRange: { min: 30000, max: 300000 },
    address: '栃木市',
    serviceCount: 20,
  },
  {
    id: '6',
    companyName: '佐藤建設',
    category: { name: '新築', slug: 'new-construction' },
    coverImageUrl: '/placeholder-business-6.jpg',
    priceRange: { min: 20000000, max: 50000000 },
    address: '那須塩原市',
    serviceCount: 5,
  },
  {
    id: '7',
    companyName: 'ヘアサロン グレース',
    category: { name: 'ヘアサロン', slug: 'hair-salon' },
    coverImageUrl: '/placeholder-business-7.jpg',
    priceRange: { min: 3000, max: 15000 },
    address: '宇都宮市',
    instagramUsername: 'grace_hair',
    serviceCount: 18,
  },
  {
    id: '8',
    companyName: '鈴木電気工事',
    category: { name: '電気工事', slug: 'electrical' },
    coverImageUrl: '/placeholder-business-8.jpg',
    priceRange: { min: 8000, max: 200000 },
    address: '小山市',
    serviceCount: 10,
  },
  {
    id: '9',
    companyName: 'ベーカリー ブレッド＆バター',
    category: { name: 'ベーカリー', slug: 'bakery' },
    coverImageUrl: '/placeholder-business-9.jpg',
    priceRange: { min: 200, max: 1500 },
    address: '佐野市',
    instagramUsername: 'bread_butter_sano',
    serviceCount: 25,
  },
];

export default function VendorsPage() {
  const [filters, setFilters] = useState<VendorFiltersType>({});
  const [sortBy, setSortBy] = useState<VendorSortBy>('displayOrder');
  const [currentPage, setCurrentPage] = useState(1);
  const [vendors, setVendors] = useState<VendorListItem[]>(mockVendors);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 9;
  const totalPages = Math.ceil(vendors.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentVendors = vendors.slice(startIndex, endIndex);

  // Fetch vendors when filters or sort changes
  useEffect(() => {
    // In real implementation, call API here
    // Example: getVendors({ page: currentPage, pageSize, filters, sortBy })
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [filters, sortBy, currentPage]);

  const handleFiltersChange = (newFilters: VendorFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (newSortBy: VendorSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-white">業者一覧</h1>
          <p className="text-lg text-orange-100">栃木県の信頼できる業者をご紹介</p>
          <div className="mt-4 text-sm text-orange-100">
            全{vendors.length}件の業者が登録されています
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="sticky top-4">
              <VendorFilters
                categories={mockCategories}
                areas={mockAreas}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Controls */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {vendors.length}件中 {startIndex + 1}〜{Math.min(endIndex, vendors.length)}
                件を表示
              </div>
              <VendorSort sortBy={sortBy} onSortChange={handleSortChange} />
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
              </div>
            ) : (
              <>
                {/* Vendor Grid */}
                {currentVendors.length > 0 ? (
                  <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {currentVendors.map((vendor) => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12">
                    <div className="mb-4 text-6xl opacity-20">🔍</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      該当する業者が見つかりませんでした
                    </h3>
                    <p className="text-gray-600">
                      検索条件を変更してもう一度お試しください
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {currentVendors.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
