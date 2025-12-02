/**
 * 枠管理ユーティリティ
 * 300社限定の枠状況管理・ウェイトリスト制御
 * とちまち - 栃木県ポータルサイト
 */

import { prisma } from './prisma';
import { WaitlistStatus } from '@prisma/client';
import type {
  CapacityStatus,
  CategoryCapacity,
  CapacityLogEntry,
  WaitlistDetail,
} from './types/waitlist';

/**
 * システム定数
 */
export const CAPACITY_CONFIG = {
  MAX_VENDORS: 300, // 最大登録業者数
  NOTIFICATION_EXPIRY_DAYS: 7, // 空き通知後の登録期限（日数）
} as const;

/**
 * 現在の枠状況を取得
 */
export async function getCapacityStatus(): Promise<CapacityStatus> {
  // アクティブな業者数をカウント
  const currentVendorCount = await prisma.vendor.count({
    where: {
      isActive: true,
      approvedAt: { not: null },
    },
  });

  // ウェイトリスト数をカウント（待機中のみ）
  const waitlistCount = await prisma.waitlist.count({
    where: {
      status: WaitlistStatus.WAITING,
    },
  });

  const availableSlots = CAPACITY_CONFIG.MAX_VENDORS - currentVendorCount;
  const isFull = availableSlots <= 0;

  return {
    totalCapacity: CAPACITY_CONFIG.MAX_VENDORS,
    currentVendorCount,
    availableSlots: Math.max(0, availableSlots),
    waitlistCount,
    isFull,
  };
}

/**
 * 業種別枠状況を取得
 */
export async function getCategoryCapacityBreakdown(): Promise<
  CategoryCapacity[]
> {
  const categories = await prisma.category.findMany({
    include: {
      vendors: {
        where: {
          isActive: true,
          approvedAt: { not: null },
        },
      },
      waitlists: {
        where: {
          status: WaitlistStatus.WAITING,
        },
      },
    },
    orderBy: {
      displayOrder: 'asc',
    },
  });

  return categories.map((category) => ({
    categoryId: category.id,
    categoryName: category.name,
    vendorCount: category.vendors.length,
    waitlistCount: category.waitlists.length,
  }));
}

/**
 * 詳細な枠状況を取得（業種別内訳含む）
 */
export async function getDetailedCapacityStatus(): Promise<
  CapacityStatus & { categoryBreakdown: CategoryCapacity[] }
> {
  const status = await getCapacityStatus();
  const categoryBreakdown = await getCategoryCapacityBreakdown();

  return {
    ...status,
    categoryBreakdown,
  };
}

/**
 * 枠が空いているかチェック
 */
export async function hasAvailableSlot(): Promise<boolean> {
  const status = await getCapacityStatus();
  return !status.isFull;
}

/**
 * ウェイトリスト登録可能かチェック
 * @param email メールアドレス
 * @returns true: 登録可能, false: 既に登録済み
 */
export async function canRegisterWaitlist(email: string): Promise<boolean> {
  // 既にVendorとして登録済みかチェック
  const existingVendor = await prisma.vendor.findUnique({
    where: { email },
  });

  if (existingVendor) {
    return false;
  }

  // 既にウェイトリストに登録済みかチェック
  const existingWaitlist = await prisma.waitlist.findUnique({
    where: { email },
  });

  if (
    existingWaitlist &&
    existingWaitlist.status !== WaitlistStatus.EXPIRED &&
    existingWaitlist.status !== WaitlistStatus.CANCELLED
  ) {
    return false;
  }

  return true;
}

/**
 * ウェイトリストに登録
 */
export async function addToWaitlist(data: {
  email: string;
  companyName: string;
  categoryId: string;
  message?: string;
}): Promise<WaitlistDetail> {
  // カテゴリ存在チェック
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new Error(`Category not found: ${data.categoryId}`);
  }

  // 重複チェック
  const canRegister = await canRegisterWaitlist(data.email);
  if (!canRegister) {
    throw new Error('Email already registered');
  }

  // 次の順番を取得
  const lastPosition = await prisma.waitlist.findFirst({
    where: { status: WaitlistStatus.WAITING },
    orderBy: { position: 'desc' },
    select: { position: true },
  });

  const nextPosition = (lastPosition?.position ?? 0) + 1;

  // ウェイトリスト登録
  const waitlist = await prisma.waitlist.create({
    data: {
      email: data.email,
      companyName: data.companyName,
      categoryId: data.categoryId,
      message: data.message,
      position: nextPosition,
      status: WaitlistStatus.WAITING,
    },
    include: {
      category: true,
    },
  });

  // ログ記録
  await logCapacityAction({
    action: 'vendor_registered',
    vendorCount: (await getCapacityStatus()).currentVendorCount,
    waitlistCount: (await getCapacityStatus()).waitlistCount,
    categoryId: data.categoryId,
    relatedId: waitlist.id,
    metadata: { email: data.email },
  });

  return {
    id: waitlist.id,
    email: waitlist.email,
    companyName: waitlist.companyName,
    categoryId: waitlist.categoryId,
    categoryName: category.name,
    message: waitlist.message ?? undefined,
    position: waitlist.position,
    status: waitlist.status,
    notifiedAt: waitlist.notifiedAt ?? undefined,
    expiresAt: waitlist.expiresAt ?? undefined,
    createdAt: waitlist.createdAt,
    updatedAt: waitlist.updatedAt,
  };
}

/**
 * 次の順番のウェイトリストエントリを取得
 * @param limit 取得件数（デフォルト: 1）
 */
export async function getNextWaitlistEntries(
  limit = 1
): Promise<WaitlistDetail[]> {
  const entries = await prisma.waitlist.findMany({
    where: {
      status: WaitlistStatus.WAITING,
    },
    orderBy: {
      position: 'asc',
    },
    take: limit,
    include: {
      category: true,
    },
  });

  return entries.map((entry) => ({
    id: entry.id,
    email: entry.email,
    companyName: entry.companyName,
    categoryId: entry.categoryId,
    categoryName: entry.category.name,
    message: entry.message ?? undefined,
    position: entry.position,
    status: entry.status,
    notifiedAt: entry.notifiedAt ?? undefined,
    expiresAt: entry.expiresAt ?? undefined,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  }));
}

/**
 * ウェイトリストに空き通知を送信（ステータス更新）
 * @param waitlistId ウェイトリストID
 * @returns 更新後のエントリ
 */
export async function notifyWaitlistEntry(
  waitlistId: string
): Promise<WaitlistDetail> {
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + CAPACITY_CONFIG.NOTIFICATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  const waitlist = await prisma.waitlist.update({
    where: { id: waitlistId },
    data: {
      status: WaitlistStatus.NOTIFIED,
      notifiedAt: now,
      expiresAt,
    },
    include: {
      category: true,
    },
  });

  return {
    id: waitlist.id,
    email: waitlist.email,
    companyName: waitlist.companyName,
    categoryId: waitlist.categoryId,
    categoryName: waitlist.category.name,
    message: waitlist.message ?? undefined,
    position: waitlist.position,
    status: waitlist.status,
    notifiedAt: waitlist.notifiedAt ?? undefined,
    expiresAt: waitlist.expiresAt ?? undefined,
    createdAt: waitlist.createdAt,
    updatedAt: waitlist.updatedAt,
  };
}

/**
 * 期限切れウェイトリストエントリを処理
 * @returns 期限切れにしたエントリ数
 */
export async function expireNotifiedWaitlists(): Promise<number> {
  const now = new Date();

  const result = await prisma.waitlist.updateMany({
    where: {
      status: WaitlistStatus.NOTIFIED,
      expiresAt: {
        lt: now,
      },
    },
    data: {
      status: WaitlistStatus.EXPIRED,
    },
  });

  // ログ記録
  if (result.count > 0) {
    await logCapacityAction({
      action: 'waitlist_expired',
      vendorCount: (await getCapacityStatus()).currentVendorCount,
      waitlistCount: (await getCapacityStatus()).waitlistCount,
      metadata: { expiredCount: result.count },
    });
  }

  return result.count;
}

/**
 * ウェイトリストを繰り上げ登録（PROMOTED状態に変更）
 * 実際のVendor作成は別の関数で行う想定
 * @param waitlistId ウェイトリストID
 */
export async function promoteWaitlistEntry(
  waitlistId: string
): Promise<WaitlistDetail> {
  const waitlist = await prisma.waitlist.update({
    where: { id: waitlistId },
    data: {
      status: WaitlistStatus.PROMOTED,
    },
    include: {
      category: true,
    },
  });

  // ログ記録
  await logCapacityAction({
    action: 'waitlist_promoted',
    vendorCount: (await getCapacityStatus()).currentVendorCount,
    waitlistCount: (await getCapacityStatus()).waitlistCount,
    categoryId: waitlist.categoryId,
    relatedId: waitlist.id,
    metadata: { email: waitlist.email },
  });

  return {
    id: waitlist.id,
    email: waitlist.email,
    companyName: waitlist.companyName,
    categoryId: waitlist.categoryId,
    categoryName: waitlist.category.name,
    message: waitlist.message ?? undefined,
    position: waitlist.position,
    status: waitlist.status,
    notifiedAt: waitlist.notifiedAt ?? undefined,
    expiresAt: waitlist.expiresAt ?? undefined,
    createdAt: waitlist.createdAt,
    updatedAt: waitlist.updatedAt,
  };
}

/**
 * ウェイトリストをキャンセル
 * @param waitlistId ウェイトリストID
 */
export async function cancelWaitlistEntry(
  waitlistId: string
): Promise<WaitlistDetail> {
  const waitlist = await prisma.waitlist.update({
    where: { id: waitlistId },
    data: {
      status: WaitlistStatus.CANCELLED,
    },
    include: {
      category: true,
    },
  });

  // ログ記録
  await logCapacityAction({
    action: 'waitlist_cancelled',
    vendorCount: (await getCapacityStatus()).currentVendorCount,
    waitlistCount: (await getCapacityStatus()).waitlistCount,
    categoryId: waitlist.categoryId,
    relatedId: waitlist.id,
    metadata: { email: waitlist.email },
  });

  return {
    id: waitlist.id,
    email: waitlist.email,
    companyName: waitlist.companyName,
    categoryId: waitlist.categoryId,
    categoryName: waitlist.category.name,
    message: waitlist.message ?? undefined,
    position: waitlist.position,
    status: waitlist.status,
    notifiedAt: waitlist.notifiedAt ?? undefined,
    expiresAt: waitlist.expiresAt ?? undefined,
    createdAt: waitlist.createdAt,
    updatedAt: waitlist.updatedAt,
  };
}

/**
 * 枠管理ログを記録
 */
export async function logCapacityAction(
  entry: CapacityLogEntry
): Promise<void> {
  await prisma.capacityLog.create({
    data: {
      action: entry.action,
      vendorCount: entry.vendorCount,
      waitlistCount: entry.waitlistCount,
      categoryId: entry.categoryId,
      relatedId: entry.relatedId,
      performedBy: entry.performedBy,
      metadata: entry.metadata ? JSON.parse(JSON.stringify(entry.metadata)) : undefined,
    },
  });
}

/**
 * ウェイトリスト全件取得（管理画面用）
 */
export async function getAllWaitlists(filters?: {
  status?: WaitlistStatus;
  categoryId?: string;
}): Promise<WaitlistDetail[]> {
  const waitlists = await prisma.waitlist.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
    },
    include: {
      category: true,
    },
    orderBy: [{ status: 'asc' }, { position: 'asc' }],
  });

  return waitlists.map((waitlist) => ({
    id: waitlist.id,
    email: waitlist.email,
    companyName: waitlist.companyName,
    categoryId: waitlist.categoryId,
    categoryName: waitlist.category.name,
    message: waitlist.message ?? undefined,
    position: waitlist.position,
    status: waitlist.status,
    notifiedAt: waitlist.notifiedAt ?? undefined,
    expiresAt: waitlist.expiresAt ?? undefined,
    createdAt: waitlist.createdAt,
    updatedAt: waitlist.updatedAt,
  }));
}

/**
 * ウェイトリストエントリを取得
 */
export async function getWaitlistEntry(
  waitlistId: string
): Promise<WaitlistDetail | null> {
  const waitlist = await prisma.waitlist.findUnique({
    where: { id: waitlistId },
    include: {
      category: true,
    },
  });

  if (!waitlist) {
    return null;
  }

  return {
    id: waitlist.id,
    email: waitlist.email,
    companyName: waitlist.companyName,
    categoryId: waitlist.categoryId,
    categoryName: waitlist.category.name,
    message: waitlist.message ?? undefined,
    position: waitlist.position,
    status: waitlist.status,
    notifiedAt: waitlist.notifiedAt ?? undefined,
    expiresAt: waitlist.expiresAt ?? undefined,
    createdAt: waitlist.createdAt,
    updatedAt: waitlist.updatedAt,
  };
}
