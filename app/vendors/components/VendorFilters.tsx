'use client';

import { useState } from 'react';
import type { VendorFilters as VendorFiltersType, Category } from '@/lib/types/vendor';

interface VendorFiltersProps {
  categories: Category[];
  areas: string[];
  filters: VendorFiltersType;
  onFiltersChange: (filters: VendorFiltersType) => void;
}

export function VendorFilters({ categories, areas, filters, onFiltersChange }: VendorFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: categoryId === filters.categoryId ? undefined : categoryId,
    });
  };

  const handleAreaChange = (area: string) => {
    onFiltersChange({
      ...filters,
      area: area === filters.area ? undefined : area,
    });
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    onFiltersChange({
      ...filters,
      priceMin: min,
      priceMax: max,
    });
  };

  const handleInstagramToggle = () => {
    onFiltersChange({
      ...filters,
      hasInstagram: filters.hasInstagram ? undefined : true,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.categoryId || filters.area || filters.priceMin || filters.priceMax || filters.hasInstagram;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* Mobile Toggle */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h3 className="text-lg font-bold text-gray-900">フィルター</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
        >
          {isOpen ? '閉じる' : '開く'}
        </button>
      </div>

      {/* Desktop Title */}
      <h3 className="mb-6 hidden text-lg font-bold text-gray-900 lg:block">絞り込み検索</h3>

      {/* Filters Content */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Category Filter */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-900">カテゴリ</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.categoryId === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Area Filter */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-900">エリア</h4>
          <div className="space-y-2">
            {areas.map((area) => (
              <label key={area} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.area === area}
                  onChange={() => handleAreaChange(area)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{area}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-900">価格帯</h4>
          <div className="space-y-2">
            {[
              { label: '〜10,000円', min: undefined, max: 10000 },
              { label: '10,000円〜30,000円', min: 10000, max: 30000 },
              { label: '30,000円〜50,000円', min: 30000, max: 50000 },
              { label: '50,000円〜', min: 50000, max: undefined },
            ].map((range) => (
              <label key={range.label} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.priceMin === range.min && filters.priceMax === range.max}
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Instagram Filter */}
        <div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={filters.hasInstagram || false}
              onChange={handleInstagramToggle}
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Instagram連携あり</span>
          </label>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            フィルターをクリア
          </button>
        )}
      </div>
    </div>
  );
}
