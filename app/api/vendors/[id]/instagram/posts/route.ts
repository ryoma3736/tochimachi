/**
 * Instagram 投稿取得 API
 *
 * GET /api/vendors/[id]/instagram/posts
 *
 * 指定業者のInstagram投稿を取得します。
 *
 * 特徴:
 * - キャッシュ優先（DBのsyncedPostsを返却）
 * - syncオプションでリアルタイム取得可能
 * - 一般公開API（認証不要）
 *
 * Query Parameters:
 * - sync: "true"でInstagram APIから最新データを取得してキャッシュ更新
 * - limit: 取得件数（デフォルト: 25）
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncInstagramPosts, InstagramAPIError } from '@/lib/instagram';

/**
 * GET /api/vendors/[id]/instagram/posts
 *
 * 業者のInstagram投稿取得
 *
 * 認証不要（一般公開API）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vendorId } = await params;
    const searchParams = request.nextUrl.searchParams;

    const shouldSync = searchParams.get('sync') === 'true';
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    // 業者存在確認
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: {
        id: true,
        companyName: true,
        isActive: true,
        instagramAccount: {
          select: {
            id: true,
            isActive: true,
            instagramUsername: true,
            lastSyncAt: true,
            syncedPosts: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (!vendor.isActive) {
      return NextResponse.json(
        { error: 'Vendor is not active' },
        { status: 403 }
      );
    }

    // Instagram連携チェック
    if (!vendor.instagramAccount?.isActive) {
      return NextResponse.json(
        {
          data: {
            isConnected: false,
            posts: [],
            message: 'Instagram account not connected',
          },
        },
        { status: 200 }
      );
    }

    // sync=trueの場合、Instagram APIから最新データを取得
    if (shouldSync) {
      try {
        const { posts } = await syncInstagramPosts(vendorId, limit);

        return NextResponse.json({
          data: {
            isConnected: true,
            username: vendor.instagramAccount.instagramUsername,
            posts,
            lastSyncAt: new Date().toISOString(),
            source: 'instagram_api', // リアルタイムデータ
          },
        });
      } catch (syncError) {
        console.error('Failed to sync Instagram posts:', syncError);

        // 同期失敗時はキャッシュデータにフォールバック
        if (syncError instanceof InstagramAPIError) {
          console.warn('Falling back to cached posts due to Instagram API error');
        }
      }
    }

    // キャッシュデータを返却（デフォルト動作）
    const cachedPosts = vendor.instagramAccount.syncedPosts
      ? Array.isArray(vendor.instagramAccount.syncedPosts)
        ? vendor.instagramAccount.syncedPosts.slice(0, limit)
        : []
      : [];

    return NextResponse.json({
      data: {
        isConnected: true,
        username: vendor.instagramAccount.instagramUsername,
        posts: cachedPosts,
        lastSyncAt: vendor.instagramAccount.lastSyncAt?.toISOString() || null,
        source: 'cache', // キャッシュデータ
      },
    });
  } catch (error) {
    console.error('GET /api/vendors/[id]/instagram/posts error:', error);

    if (error instanceof InstagramAPIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    );
  }
}
