/**
 * 問い合わせ関連の型定義
 * とちまち - 栃木県ポータルサイト
 */

import { InquiryStatus as PrismaInquiryStatus } from '@prisma/client';

/**
 * 連絡方法
 */
export type ContactMethod = 'email' | 'phone' | 'both';

/**
 * 希望時間帯
 */
export type PreferredTime = 'morning' | 'afternoon' | 'evening';

/**
 * お客様情報
 */
export interface CustomerInfo {
  name: string;
  nameKana: string;
  email: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
}

/**
 * 問い合わせ詳細
 */
export interface InquiryDetails {
  preferredDate?: string;
  preferredTime?: PreferredTime;
  contactMethod: ContactMethod;
  message?: string;
}

/**
 * 完全な問い合わせデータ
 */
export interface InquiryData {
  customer: CustomerInfo;
  details: InquiryDetails;
  vendorIds: string[];
  createdAt: Date;
  status: PrismaInquiryStatus;
}

// ========================================
// API用の型定義（追加）
// ========================================

/**
 * 問い合わせ作成リクエスト
 */
export interface CreateInquiryRequest {
  vendorId: string;
  message: string;
  userId?: string; // ログインユーザーの場合
  guestName?: string; // ゲストの場合
  guestEmail?: string; // ゲストの場合
  guestPhone?: string; // ゲストの場合
  items: Array<{
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    quantity: number;
    note?: string;
  }>;
}

/**
 * 問い合わせ更新リクエスト
 */
export interface UpdateInquiryRequest {
  message?: string;
  status?: PrismaInquiryStatus;
  vendorReply?: string;
}

/**
 * 問い合わせアイテム情報
 */
export interface InquiryItemInfo {
  id: string;
  serviceId: string | null;
  serviceName: string;
  servicePrice: number;
  quantity: number;
  note: string | null;
  createdAt: Date;
}

/**
 * 問い合わせ詳細レスポンス
 */
export interface InquiryDetailResponse {
  id: string;
  vendorId: string;
  userId: string | null;
  status: PrismaInquiryStatus;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  message: string;
  vendorReply: string | null;
  repliedAt: Date | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items: InquiryItemInfo[];
  vendor?: {
    id: string;
    companyName: string;
    email: string;
    profile?: {
      contactPhone: string;
    } | null;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

/**
 * 問い合わせ一覧アイテム
 */
export interface InquiryListItem {
  id: string;
  vendorId: string;
  status: PrismaInquiryStatus;
  customerName: string; // guestName または user.name
  customerEmail: string | null;
  message: string;
  submittedAt: Date | null;
  createdAt: Date;
  itemsCount: number;
  vendor?: {
    companyName: string;
  };
}

/**
 * 問い合わせ一覧レスポンス（ページネーション付き）
 */
export interface InquiryListResponse {
  inquiries: InquiryListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 問い合わせ統計情報
 */
export interface InquiryStats {
  total: number;
  draft: number;
  submitted: number;
  replied: number;
  closed: number;
}
