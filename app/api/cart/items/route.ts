/**
 * カートアイテムAPI - POST
 *
 * POST /api/cart/items - カートにアイテム追加
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getOrCreateSessionId,
  getOrCreateCart,
  addCartItem,
} from '@/lib/cart';

/**
 * リクエストボディの型定義
 */
interface AddCartItemRequest {
  vendorId: string;
  serviceId?: string | null;
  quantity?: number;
  notes?: string | null;
}

/**
 * POST /api/cart/items
 * カートにアイテムを追加
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディ解析
    const body: AddCartItemRequest = await request.json();
    const { vendorId, serviceId, quantity = 1, notes } = body;

    // バリデーション
    if (!vendorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vendor ID is required',
        },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quantity must be at least 1',
        },
        { status: 400 }
      );
    }

    // セッションIDを取得または生成
    const sessionId = await getOrCreateSessionId();

    // TODO: 認証実装後、userIdを取得
    const userId = null; // await getCurrentUserId();

    // カート取得または作成
    const cart = await getOrCreateCart(sessionId, userId);

    // アイテム追加
    const newItem = await addCartItem(
      cart.id,
      vendorId,
      serviceId,
      quantity,
      notes
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Item added to cart successfully',
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding item to cart:', error);

    // エラーメッセージの詳細化
    if (error instanceof Error) {
      if (error.message.includes('Vendor not found')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Vendor not found',
            message: error.message,
          },
          { status: 404 }
        );
      }

      if (error.message.includes('Service not found')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Service not found',
            message: error.message,
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add item to cart',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
