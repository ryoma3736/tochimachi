import { cn } from '@/lib/utils';

export interface PriceRangeProps {
  min: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'badge';
}

export default function PriceRange({ min, max, className, variant = 'default' }: PriceRangeProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(0)}万円`;
    }
    return `${price.toLocaleString('ja-JP')}円`;
  };

  const getPriceRangeText = () => {
    if (max) {
      return `${formatPrice(min)}〜${formatPrice(max)}`;
    }
    return `${formatPrice(min)}〜`;
  };

  const variantStyles = {
    default: 'text-base font-semibold text-primary',
    compact: 'text-sm font-medium text-primary',
    badge:
      'inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary',
  };

  return <div className={cn(variantStyles[variant], className)}>{getPriceRangeText()}</div>;
}

// Price range categories helper
export const PRICE_RANGES = [
  { id: '1', label: '〜5万円', min: 0, max: 50000 },
  { id: '2', label: '5万円〜10万円', min: 50000, max: 100000 },
  { id: '3', label: '10万円〜30万円', min: 100000, max: 300000 },
  { id: '4', label: '30万円〜50万円', min: 300000, max: 500000 },
  { id: '5', label: '50万円〜100万円', min: 500000, max: 1000000 },
  { id: '6', label: '100万円〜', min: 1000000, max: undefined },
];

// Price range filter component
interface PriceRangeFilterProps {
  selectedRange?: string;
  onRangeChange?: (rangeId: string) => void;
}

export function PriceRangeFilter({ selectedRange, onRangeChange }: PriceRangeFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">予算から探す</h3>
      <div className="flex flex-wrap gap-2">
        {PRICE_RANGES.map((range) => (
          <button
            key={range.id}
            onClick={() => onRangeChange?.(range.id)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              selectedRange === range.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:border-primary hover:bg-primary/10'
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
