/**
 * Zustand Cart Store - カート状態管理
 *
 * 責務:
 * - カートアイテムの追加・更新・削除
 * - localStorage永続化
 * - 合計金額計算
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * カートアイテムの型定義
 */
export interface CartItem {
  id: string;
  vendorId: string;
  vendorName: string;
  serviceName: string;
  services: string[]; // 選択されたサービス一覧
  estimatedPrice: number; // 概算料金
  imageUrl?: string;
  notes?: string; // お客様のメモ
  quantity: number;
}

/**
 * カートストアの状態
 */
interface CartStore {
  items: CartItem[];

  // アクション
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;

  // 計算プロパティ
  getTotalPrice: () => number;
  getItemCount: () => number;
  hasVendor: (vendorId: string) => boolean;
}

/**
 * Zustand Store作成
 * localStorage永続化を含む
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * カートにアイテム追加
       * 既に同じ業者が存在する場合は更新
       */
      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.vendorId === item.vendorId
          );

          if (existingItemIndex !== -1) {
            // 既存アイテムを更新
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              ...item,
              quantity: updatedItems[existingItemIndex].quantity,
            };
            return { items: updatedItems };
          }

          // 新規アイテム追加
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },

      /**
       * アイテム更新
       */
      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      /**
       * 数量更新
       */
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      /**
       * アイテム削除
       */
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      /**
       * カートクリア
       */
      clearCart: () => {
        set({ items: [] });
      },

      /**
       * 合計金額計算
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.estimatedPrice * item.quantity,
          0
        );
      },

      /**
       * アイテム数取得
       */
      getItemCount: () => {
        return get().items.length;
      },

      /**
       * 特定の業者がカートに含まれているか確認
       */
      hasVendor: (vendorId) => {
        return get().items.some((item) => item.vendorId === vendorId);
      },
    }),
    {
      name: 'tochimachi-cart-storage', // localStorageキー
      storage: createJSONStorage(() => localStorage),
    }
  )
);
