/**
 * カートAPI - GET/DELETE
 *
 * GET /api/cart - カート取得
 * DELETE /api/cart - カートクリア
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getOrCreateSessionId,
  getOrCreateCart,
  clearCart,
  calculateCartTotal,
} from '@/lib/cart';

/**
 * GET /api/cart
 * セッションIDに紐づくカート情報を取得
 */
export async function GET(request: NextRequest) {
  try {
    // セッションIDを取得または生成
    const sessionId = await getOrCreateSessionId();

    // TODO: 認証実装後、userIdを取得
    const userId = null; // await getCurrentUserId();

    // カート取得
    const cart = await getOrCreateCart(sessionId, userId);

    // 合計金額計算
    const totalPrice = calculateCartTotal(cart);

    return NextResponse.json({
      success: true,
      data: {
        cart,
        totalPrice,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cart',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * カートを全てクリア
 */
export async function DELETE(request: NextRequest) {
  try {
    // セッションIDを取得
    const sessionId = await getOrCreateSessionId();

    // TODO: 認証実装後、userIdを取得
    const userId = null; // await getCurrentUserId();

    // カート取得
    const cart = await getOrCreateCart(sessionId, userId);

    // カートクリア
    await clearCart(cart.id);

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cart',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
