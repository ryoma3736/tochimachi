'use client';

import type { VendorSortBy } from '@/lib/types/vendor';

interface VendorSortProps {
  sortBy: VendorSortBy;
  onSortChange: (sortBy: VendorSortBy) => void;
}

const sortOptions: { value: VendorSortBy; label: string }[] = [
  { value: 'displayOrder', label: 'おすすめ順' },
  { value: 'companyName', label: '名前順' },
  { value: 'priceAsc', label: '価格が安い順' },
  { value: 'priceDesc', label: '価格が高い順' },
  { value: 'newest', label: '新着順' },
];

export function VendorSort({ sortBy, onSortChange }: VendorSortProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort-select" className="text-sm font-semibold text-gray-700">
        並び替え:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as VendorSortBy)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
