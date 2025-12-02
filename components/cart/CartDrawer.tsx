'use client';

import { X, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/stores/cart-store';
import CartItem from './CartItem';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  const handleCheckout = () => {
    onClose();
    router.push('/inquiry');
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full bg-white shadow-2xl transition-transform duration-300 sm:w-96',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">カート ({getItemCount()})</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(100%-4rem)] flex-col">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-8 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">カートは空です</p>
                <p className="text-sm text-muted-foreground">サービスを追加してください</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                サービスを探す
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.serviceName}
                    vendorName={item.vendorName}
                    price={item.estimatedPrice}
                    quantity={item.quantity}
                    imageUrl={item.imageUrl}
                    onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t bg-muted/50 p-4">
                {/* Total */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">合計</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full rounded-lg bg-primary px-4 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    お問い合わせ・見積依頼
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    買い物を続ける
                  </button>
                </div>

                {/* Note */}
                <p className="mt-4 text-xs text-muted-foreground">
                  ※ 実際の価格は業者との相談で確定します
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Cart button with badge
interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
  className?: string;
}

export function CartButton({ itemCount, onClick, className }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative rounded-full p-2 text-foreground transition-colors hover:bg-accent',
        className
      )}
      aria-label="カート"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
