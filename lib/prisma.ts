/**
 * Prisma Client Singleton for とちまち
 *
 * Next.js開発環境でのホットリロード対応
 * グローバルインスタンスを使用してコネクション数を制限
 */

import { PrismaClient } from '@prisma/client';

// グローバルなPrismaインスタンスの型定義
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Prismaクライアントのシングルトンインスタンス
 *
 * 本番環境: 新しいPrismaClientインスタンスを生成
 * 開発環境: グローバル変数を使用してホットリロード時の再接続を防止
 */
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// 開発環境ではグローバル変数に保存
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * 300社制限チェック
 * 新規業者登録時に呼び出し
 *
 * @returns {Promise<boolean>} true: 登録可能, false: 上限到達
 */
export async function canRegisterNewVendor(): Promise<boolean> {
  const count = await prisma.vendor.count({
    where: { isActive: true },
  });
  return count < 300;
}

/**
 * 次に利用可能なdisplayOrder取得
 * 1〜300の範囲で未使用の最小値を返す
 *
 * @returns {Promise<number | null>} displayOrder (1-300) or null if full
 */
export async function getNextDisplayOrder(): Promise<number | null> {
  // すべてのアクティブな業者のdisplayOrderを取得
  const usedOrders = await prisma.vendor.findMany({
    where: { isActive: true },
    select: { displayOrder: true },
    orderBy: { displayOrder: 'asc' },
  });

  const usedSet = new Set(usedOrders.map(v => v.displayOrder));

  // 1〜300の範囲で未使用の最小値を探す
  for (let i = 1; i <= 300; i++) {
    if (!usedSet.has(i)) {
      return i;
    }
  }

  return null; // 300社上限到達
}
