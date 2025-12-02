/**
 * カートアイテム個別操作API - PUT/DELETE
 *
 * PUT /api/cart/items/:id - アイテム更新
 * DELETE /api/cart/items/:id - アイテム削除
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateCartItem, deleteCartItem } from '@/lib/cart';

/**
 * リクエストボディの型定義
 */
interface UpdateCartItemRequest {
  quantity?: number;
  notes?: string | null;
}

/**
 * PUT /api/cart/items/:id
 * カートアイテムを更新
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // リクエストボディ解析
    const body: UpdateCartItemRequest = await request.json();
    const { quantity, notes } = body;

    // バリデーション
    if (quantity !== undefined && quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quantity must be at least 1',
        },
        { status: 400 }
      );
    }

    // 更新データを構築
    const updates: { quantity?: number; notes?: string | null } = {};
    if (quantity !== undefined) {
      updates.quantity = quantity;
    }
    if (notes !== undefined) {
      updates.notes = notes;
    }

    // アイテム更新
    const updatedItem = await updateCartItem(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);

    // Prismaエラーハンドリング
    if (error instanceof Error) {
      // レコードが見つからない場合
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cart item not found',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart item',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart/items/:id
 * カートアイテムを削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // アイテム削除
    await deleteCartItem(id);

    return NextResponse.json({
      success: true,
      message: 'Cart item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting cart item:', error);

    // Prismaエラーハンドリング
    if (error instanceof Error) {
      // レコードが見つからない場合
      if (error.message.includes('Record to delete does not exist')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cart item not found',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete cart item',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
