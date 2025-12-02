import { Check, Clock, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  duration?: string;
  features?: string[];
  popular?: boolean;
  onAddToCart?: (id: string) => void;
}

export default function ServiceCard({
  id,
  title,
  description,
  price,
  duration,
  features = [],
  popular = false,
  onAddToCart,
}: ServiceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg',
        popular && 'ring-2 ring-primary'
      )}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-md">
            人気
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4 p-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-primary">{formatPrice(price)}</span>
          <span className="text-sm text-muted-foreground">〜</span>
        </div>

        {/* Duration */}
        {duration && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/50 p-4">
        <button
          onClick={() => onAddToCart?.(id)}
          className={cn(
            'flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
            popular
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>カートに追加</span>
        </button>
      </div>
    </div>
  );
}
