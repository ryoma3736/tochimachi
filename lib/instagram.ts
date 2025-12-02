/**
 * Instagram Basic Display API Integration
 *
 * とちまち Instagram連携コア機能
 *
 * 機能:
 * - OAuth 2.0 認証フロー
 * - アクセストークン管理（短期・長期）
 * - Instagram投稿データ取得
 * - トークンリフレッシュ自動化
 *
 * @see https://developers.facebook.com/docs/instagram-basic-display-api
 */

import { InstagramAccount } from '@prisma/client';
import { prisma } from './prisma';
import { encrypt, decrypt } from './utils/encryption';

// Instagram API 設定
const INSTAGRAM_API_BASE = 'https://api.instagram.com';
const INSTAGRAM_GRAPH_BASE = 'https://graph.instagram.com';

// 環境変数チェック
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/instagram/callback`;

if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
  console.warn('⚠️ Instagram API credentials not configured');
}

/**
 * Instagram投稿データ型
 */
export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  username?: string;
}

/**
 * Instagram APIレスポンス型
 */
export interface InstagramMediaResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Instagramトークン交換レスポンス
 */
interface TokenExchangeResponse {
  access_token: string;
  user_id: number;
}

/**
 * Instagram長期トークンレスポンス
 */
interface LongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // 秒単位（約60日）
}

/**
 * エラー型定義
 */
export class InstagramAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'InstagramAPIError';
  }
}

/**
 * Instagram OAuth認証URL生成
 *
 * @param vendorId - 業者ID（stateパラメータとして使用）
 * @returns 認証URL
 */
export function getInstagramAuthUrl(vendorId: string): string {
  if (!INSTAGRAM_APP_ID || !INSTAGRAM_REDIRECT_URI) {
    throw new InstagramAPIError('Instagram API not configured', 500);
  }

  const params = new URLSearchParams({
    client_id: INSTAGRAM_APP_ID,
    redirect_uri: INSTAGRAM_REDIRECT_URI,
    scope: 'user_profile,user_media',
    response_type: 'code',
    state: vendorId, // CSRF対策とvendorId識別
  });

  return `${INSTAGRAM_API_BASE}/oauth/authorize?${params.toString()}`;
}

/**
 * 短期アクセストークンを長期トークンに交換
 *
 * @param shortLivedToken - 短期トークン
 * @returns 長期トークンと有効期限
 */
async function exchangeForLongLivedToken(shortLivedToken: string): Promise<{
  accessToken: string;
  expiresAt: Date;
}> {
  if (!INSTAGRAM_APP_SECRET) {
    throw new InstagramAPIError('Instagram App Secret not configured', 500);
  }

  const params = new URLSearchParams({
    grant_type: 'ig_exchange_token',
    client_secret: INSTAGRAM_APP_SECRET,
    access_token: shortLivedToken,
  });

  const response = await fetch(`${INSTAGRAM_GRAPH_BASE}/access_token?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new InstagramAPIError(
      'Failed to exchange for long-lived token',
      response.status,
      error
    );
  }

  const data: LongLivedTokenResponse = await response.json();

  // 有効期限計算（60日 - 1日のバッファ）
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + data.expires_in - 86400);

  return {
    accessToken: data.access_token,
    expiresAt,
  };
}

/**
 * 認証コードをアクセストークンに交換
 *
 * @param code - OAuth認証コード
 * @returns 短期アクセストークンとユーザーID
 */
async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string;
  userId: number;
}> {
  if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET || !INSTAGRAM_REDIRECT_URI) {
    throw new InstagramAPIError('Instagram API not configured', 500);
  }

  const formData = new URLSearchParams({
    client_id: INSTAGRAM_APP_ID,
    client_secret: INSTAGRAM_APP_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: INSTAGRAM_REDIRECT_URI,
    code,
  });

  const response = await fetch(`${INSTAGRAM_API_BASE}/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new InstagramAPIError(
      'Failed to exchange code for token',
      response.status,
      error
    );
  }

  const data: TokenExchangeResponse = await response.json();

  return {
    accessToken: data.access_token,
    userId: data.user_id,
  };
}

/**
 * Instagram OAuth認証完了処理
 *
 * @param vendorId - 業者ID
 * @param code - OAuth認証コード
 * @returns 作成されたInstagramアカウント
 */
export async function completeInstagramAuth(
  vendorId: string,
  code: string
): Promise<InstagramAccount> {
  // Step 1: 認証コード → 短期トークン
  const { accessToken: shortToken, userId } = await exchangeCodeForToken(code);

  // Step 2: 短期トークン → 長期トークン
  const { accessToken, expiresAt } = await exchangeForLongLivedToken(shortToken);

  // Step 3: ユーザー情報取得
  const userInfo = await getInstagramUserInfo(accessToken);

  // Step 4: トークンを暗号化してDB保存
  const encryptedToken = encrypt(accessToken);

  const instagramAccount = await prisma.instagramAccount.upsert({
    where: { vendorId },
    create: {
      vendorId,
      instagramUsername: userInfo.username,
      accessToken: encryptedToken,
      isActive: true,
    },
    update: {
      instagramUsername: userInfo.username,
      accessToken: encryptedToken,
      isActive: true,
      updatedAt: new Date(),
    },
  });

  return instagramAccount;
}

/**
 * Instagramユーザー情報取得
 */
async function getInstagramUserInfo(accessToken: string): Promise<{
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
}> {
  const params = new URLSearchParams({
    fields: 'id,username,account_type,media_count',
    access_token: accessToken,
  });

  const response = await fetch(`${INSTAGRAM_GRAPH_BASE}/me?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new InstagramAPIError(
      'Failed to fetch Instagram user info',
      response.status,
      error
    );
  }

  return response.json();
}

/**
 * Instagram投稿取得（ページネーション対応）
 *
 * @param accessToken - アクセストークン
 * @param limit - 取得件数（デフォルト: 25、最大: 100）
 * @param after - ページネーションカーソル
 * @returns Instagram投稿データ
 */
export async function fetchInstagramPosts(
  accessToken: string,
  limit: number = 25,
  after?: string
): Promise<InstagramMediaResponse> {
  const params = new URLSearchParams({
    fields: 'id,caption,media_type,media_url,permalink,timestamp,username',
    access_token: accessToken,
    limit: Math.min(limit, 100).toString(),
  });

  if (after) {
    params.append('after', after);
  }

  const response = await fetch(
    `${INSTAGRAM_GRAPH_BASE}/me/media?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new InstagramAPIError(
      'Failed to fetch Instagram posts',
      response.status,
      error
    );
  }

  return response.json();
}

/**
 * 業者のInstagram投稿を同期
 *
 * @param vendorId - 業者ID
 * @param maxPosts - 最大取得件数（デフォルト: 50）
 * @returns 同期された投稿数
 */
export async function syncInstagramPosts(
  vendorId: string,
  maxPosts: number = 50
): Promise<{
  syncedCount: number;
  posts: InstagramPost[];
}> {
  // Instagram連携情報取得
  const account = await prisma.instagramAccount.findUnique({
    where: { vendorId },
  });

  if (!account || !account.isActive || !account.accessToken) {
    throw new InstagramAPIError('Instagram account not connected', 404);
  }

  // アクセストークン復号化
  const accessToken = decrypt(account.accessToken);

  // 投稿取得
  const response = await fetchInstagramPosts(accessToken, Math.min(maxPosts, 100));
  const posts = response.data;

  // DB更新（syncedPostsフィールドにJSON保存）
  await prisma.instagramAccount.update({
    where: { vendorId },
    data: {
      syncedPosts: posts as any, // Prisma JsonValue型対応
      lastSyncAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return {
    syncedCount: posts.length,
    posts,
  };
}

/**
 * Instagram連携解除
 *
 * @param vendorId - 業者ID
 */
export async function disconnectInstagram(vendorId: string): Promise<void> {
  const account = await prisma.instagramAccount.findUnique({
    where: { vendorId },
  });

  if (!account) {
    throw new InstagramAPIError('Instagram account not found', 404);
  }

  // アクセストークンを削除してisActiveをfalseに
  await prisma.instagramAccount.update({
    where: { vendorId },
    data: {
      accessToken: null,
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

/**
 * Instagramトークンリフレッシュ
 *
 * 有効期限の7日前にトークンをリフレッシュ
 *
 * @param vendorId - 業者ID
 * @returns リフレッシュ成功/失敗
 */
export async function refreshInstagramToken(vendorId: string): Promise<boolean> {
  const account = await prisma.instagramAccount.findUnique({
    where: { vendorId },
  });

  if (!account || !account.accessToken) {
    return false;
  }

  try {
    const accessToken = decrypt(account.accessToken);

    // 長期トークンの更新（既存トークンを使用して新しいトークンを取得）
    const params = new URLSearchParams({
      grant_type: 'ig_refresh_token',
      access_token: accessToken,
    });

    const response = await fetch(`${INSTAGRAM_GRAPH_BASE}/refresh_access_token?${params.toString()}`);

    if (!response.ok) {
      console.error('Failed to refresh Instagram token:', await response.text());
      return false;
    }

    const data: LongLivedTokenResponse = await response.json();

    // 新しいトークンを暗号化して保存
    const encryptedToken = encrypt(data.access_token);

    await prisma.instagramAccount.update({
      where: { vendorId },
      data: {
        accessToken: encryptedToken,
        updatedAt: new Date(),
      },
    });

    return true;
  } catch (error) {
    console.error('refreshInstagramToken error:', error);
    return false;
  }
}

/**
 * Instagram連携ステータス取得
 *
 * @param vendorId - 業者ID
 */
export async function getInstagramStatus(vendorId: string): Promise<{
  isConnected: boolean;
  username?: string;
  lastSyncAt?: Date | null;
  postsCount?: number;
}> {
  const account = await prisma.instagramAccount.findUnique({
    where: { vendorId },
  });

  if (!account || !account.isActive) {
    return { isConnected: false };
  }

  const postsCount = account.syncedPosts
    ? Array.isArray(account.syncedPosts)
      ? account.syncedPosts.length
      : 0
    : 0;

  return {
    isConnected: true,
    username: account.instagramUsername,
    lastSyncAt: account.lastSyncAt,
    postsCount,
  };
}
