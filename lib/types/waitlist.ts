/**
 * ウェイトリスト・枠管理の型定義
 * とちまち - 栃木県ポータルサイト
 */

import { WaitlistStatus } from '@prisma/client';

/**
 * ウェイトリスト登録データ
 */
export interface WaitlistRegistrationData {
  email: string;
  companyName: string;
  categoryId: string;
  message?: string;
}

/**
 * ウェイトリスト詳細（カテゴリ情報含む）
 */
export interface WaitlistDetail {
  id: string;
  email: string;
  companyName: string;
  categoryId: string;
  categoryName: string;
  message?: string;
  position: number;
  status: WaitlistStatus;
  notifiedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 枠状況データ
 */
export interface CapacityStatus {
  totalCapacity: number; // 300
  currentVendorCount: number;
  availableSlots: number;
  waitlistCount: number;
  isFull: boolean;
  categoryBreakdown?: CategoryCapacity[];
}

/**
 * 業種別枠状況
 */
export interface CategoryCapacity {
  categoryId: string;
  categoryName: string;
  vendorCount: number;
  waitlistCount: number;
}

/**
 * ウェイトリスト昇格（繰り上げ登録）データ
 */
export interface WaitlistPromotionData {
  waitlistId: string;
  vendorEmail: string;
  vendorPassword: string; // 初期パスワード
  companyName: string;
  categoryId: string;
}

/**
 * 枠管理ログアクション
 */
export type CapacityAction =
  | 'vendor_registered'
  | 'vendor_cancelled'
  | 'waitlist_promoted'
  | 'waitlist_expired'
  | 'waitlist_cancelled';

/**
 * 枠管理ログエントリ
 */
export interface CapacityLogEntry {
  action: CapacityAction;
  vendorCount: number;
  waitlistCount: number;
  categoryId?: string;
  relatedId?: string;
  performedBy?: string;
  metadata?: Record<string, unknown>;
}
