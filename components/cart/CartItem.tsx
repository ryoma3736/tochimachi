import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';

export interface CartItemData {
  id: string;
  name: string;
  vendorName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  duration?: string;
}

interface CartItemProps extends CartItemData {
  onUpdateQuantity?: (quantity: number) => void;
  onRemove?: () => void;
}

export default function CartItem({
  id,
  name,
  vendorName,
  price,
  quantity,
  imageUrl,
  duration,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  const handleIncrement = () => {
    onUpdateQuantity?.(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity?.(quantity - 1);
    }
  };

  return (
    <div className="flex space-x-3 rounded-lg border bg-card p-3">
      {/* Image */}
      {imageUrl && (
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          <Image src={imageUrl} alt={name} fill className="object-cover" sizes="80px" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Info */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground">{name}</h4>
          <p className="text-xs text-muted-foreground">{vendorName}</p>
          {duration && <p className="text-xs text-muted-foreground">{duration}</p>}
        </div>

        {/* Bottom: Price & Controls */}
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="rounded-md border p-1 transition-colors hover:bg-accent disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="数量を減らす"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="rounded-md border p-1 transition-colors hover:bg-accent"
              aria-label="数量を増やす"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-primary">{formatPrice(price * quantity)}</span>
            <button
              onClick={onRemove}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="削除"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
