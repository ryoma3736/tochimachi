/**
 * カート管理ユーティリティ
 *
 * 責務:
 * - セッションIDベースのカート取得・作成
 * - ゲストカートとログインユーザーカートのマージ
 * - カート有効期限管理（7日間）
 * - カートアイテムのCRUD操作
 */

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

/**
 * セッションID Cookie名
 */
const SESSION_COOKIE_NAME = 'tochimachi_session_id';

/**
 * カート有効期限（7日間）
 */
const CART_EXPIRATION_DAYS = 7;

/**
 * カートデータの型定義
 */
export interface CartData {
  id: string;
  userId: string | null;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  items: CartItemData[];
}

export interface CartItemData {
  id: string;
  vendorId: string;
  serviceId: string | null;
  quantity: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  vendor: {
    id: string;
    companyName: string;
    categoryId: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
    unit: string;
  } | null;
}

/**
 * 新しいセッションIDを生成
 */
export function generateSessionId(): string {
  return randomBytes(32).toString('hex');
}

/**
 * 現在のセッションIDを取得（なければ生成）
 */
export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    sessionId = generateSessionId();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30日間
      path: '/',
    });
  }

  return sessionId;
}

/**
 * カート有効期限を計算
 */
export function calculateCartExpiration(): Date {
  const now = new Date();
  return new Date(now.getTime() + CART_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * セッションIDからカートを取得（存在しなければ作成）
 */
export async function getOrCreateCart(
  sessionId: string,
  userId?: string | null
): Promise<CartData> {
  // 既存カートを検索
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          vendor: {
            select: {
              id: true,
              companyName: true,
              categoryId: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              price: true,
              unit: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  // カートが存在しない場合は新規作成
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        sessionId,
        userId: userId || null,
        expiresAt: calculateCartExpiration(),
      },
      include: {
        items: {
          include: {
            vendor: {
              select: {
                id: true,
                companyName: true,
                categoryId: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                unit: true,
              },
            },
          },
        },
      },
    });
  }

  // 期限切れチェック
  if (cart.expiresAt < new Date()) {
    // 期限切れカートをクリアして新規作成
    await prisma.cart.delete({ where: { id: cart.id } });
    cart = await prisma.cart.create({
      data: {
        sessionId,
        userId: userId || null,
        expiresAt: calculateCartExpiration(),
      },
      include: {
        items: {
          include: {
            vendor: {
              select: {
                id: true,
                companyName: true,
                categoryId: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                unit: true,
              },
            },
          },
        },
      },
    });
  }

  return cart as CartData;
}

/**
 * カートにアイテムを追加
 */
export async function addCartItem(
  cartId: string,
  vendorId: string,
  serviceId?: string | null,
  quantity: number = 1,
  notes?: string | null
): Promise<CartItemData> {
  // 業者とサービスの存在確認
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  if (!vendor) {
    throw new Error(`Vendor not found: ${vendorId}`);
  }

  if (serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new Error(`Service not found: ${serviceId}`);
    }
  }

  // 既存アイテムチェック（同じ業者・サービスの組み合わせ）
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId,
      vendorId,
      serviceId: serviceId || null,
    },
  });

  if (existingItem) {
    // 既存アイテムの数量を更新
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
        notes: notes || existingItem.notes,
      },
      include: {
        vendor: {
          select: {
            id: true,
            companyName: true,
            categoryId: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            unit: true,
          },
        },
      },
    });
    return updatedItem as CartItemData;
  }

  // 新規アイテム追加
  const newItem = await prisma.cartItem.create({
    data: {
      cartId,
      vendorId,
      serviceId: serviceId || null,
      quantity,
      notes: notes || null,
    },
    include: {
      vendor: {
        select: {
          id: true,
          companyName: true,
          categoryId: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          unit: true,
        },
      },
    },
  });

  return newItem as CartItemData;
}

/**
 * カートアイテムを更新
 */
export async function updateCartItem(
  itemId: string,
  updates: {
    quantity?: number;
    notes?: string | null;
  }
): Promise<CartItemData> {
  const updatedItem = await prisma.cartItem.update({
    where: { id: itemId },
    data: updates,
    include: {
      vendor: {
        select: {
          id: true,
          companyName: true,
          categoryId: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          unit: true,
        },
      },
    },
  });

  return updatedItem as CartItemData;
}

/**
 * カートアイテムを削除
 */
export async function deleteCartItem(itemId: string): Promise<void> {
  await prisma.cartItem.delete({
    where: { id: itemId },
  });
}

/**
 * カートを全てクリア
 */
export async function clearCart(cartId: string): Promise<void> {
  await prisma.cartItem.deleteMany({
    where: { cartId },
  });
}

/**
 * ゲストカートをログインユーザーにマージ
 * ログイン時に呼ばれる
 */
export async function mergeGuestCartToUser(
  guestSessionId: string,
  userId: string
): Promise<CartData> {
  // ゲストカートを取得
  const guestCart = await prisma.cart.findUnique({
    where: { sessionId: guestSessionId },
    include: {
      items: true,
    },
  });

  if (!guestCart || guestCart.items.length === 0) {
    // ゲストカートが空の場合、ユーザーカートを返す
    return getOrCreateCart(guestSessionId, userId);
  }

  // ユーザーの既存カートを検索
  const userCart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (userCart) {
    // ユーザーカートが既に存在する場合、ゲストカートのアイテムを移動
    for (const item of guestCart.items) {
      // 既存アイテムチェック
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          vendorId: item.vendorId,
          serviceId: item.serviceId,
        },
      });

      if (existingItem) {
        // 数量を加算
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + item.quantity,
          },
        });
      } else {
        // 新規アイテムとして追加
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            vendorId: item.vendorId,
            serviceId: item.serviceId,
            quantity: item.quantity,
            notes: item.notes,
          },
        });
      }
    }

    // ゲストカートを削除
    await prisma.cart.delete({
      where: { id: guestCart.id },
    });

    // 更新されたユーザーカートを返す
    return getOrCreateCart(userCart.sessionId, userId);
  } else {
    // ユーザーカートがない場合、ゲストカートをユーザーに紐付け
    const updatedCart = await prisma.cart.update({
      where: { id: guestCart.id },
      data: {
        userId,
        expiresAt: calculateCartExpiration(),
      },
      include: {
        items: {
          include: {
            vendor: {
              select: {
                id: true,
                companyName: true,
                categoryId: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    return updatedCart as CartData;
  }
}

/**
 * カート合計金額を計算
 */
export function calculateCartTotal(cart: CartData): number {
  return cart.items.reduce((total, item) => {
    const price = item.service?.price || 0;
    return total + Number(price) * item.quantity;
  }, 0);
}

/**
 * 期限切れカートをクリーンアップ（バッチ処理用）
 */
export async function cleanupExpiredCarts(): Promise<number> {
  const result = await prisma.cart.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}
