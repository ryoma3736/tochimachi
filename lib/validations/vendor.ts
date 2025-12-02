/**
 * Zod Validation Schemas for Vendor API
 *
 * 業者管理APIのバリデーション定義
 */

import { z } from 'zod';

// ========================================
// Vendor (業者) スキーマ
// ========================================

/**
 * 業者新規登録スキーマ
 */
export const createVendorSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  companyName: z
    .string()
    .min(1, { message: 'Company name is required' })
    .max(100, { message: 'Company name must be less than 100 characters' }),
  categoryId: z.string().uuid({ message: 'Invalid category ID' }),
});

/**
 * 業者更新スキーマ（パスワード以外）
 */
export const updateVendorSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  companyName: z
    .string()
    .min(1, { message: 'Company name is required' })
    .max(100, { message: 'Company name must be less than 100 characters' })
    .optional(),
  categoryId: z.string().uuid({ message: 'Invalid category ID' }).optional(),
  isActive: z.boolean().optional(),
});

/**
 * 業者一覧取得クエリパラメータスキーマ
 */
export const getVendorsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .default('20')
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().positive().max(100)),
  categoryId: z.string().uuid().optional(),
  isActive: z
    .string()
    .optional()
    .transform(val => val === 'true'),
  search: z.string().optional(),
});

// ========================================
// VendorProfile (業者プロフィール) スキーマ
// ========================================

/**
 * 営業時間の型定義
 */
export const businessHoursSchema = z.object({
  mon: z.string().optional(),
  tue: z.string().optional(),
  wed: z.string().optional(),
  thu: z.string().optional(),
  fri: z.string().optional(),
  sat: z.string().optional(),
  sun: z.string().optional(),
});

/**
 * 業者プロフィール作成/更新スキーマ
 */
export const vendorProfileSchema = z.object({
  description: z
    .string()
    .max(2000, { message: 'Description must be less than 2000 characters' })
    .optional(),
  logoUrl: z.string().url({ message: 'Invalid logo URL' }).optional(),
  coverImageUrl: z.string().url({ message: 'Invalid cover image URL' }).optional(),
  businessHours: businessHoursSchema.optional(),
  address: z
    .string()
    .min(1, { message: 'Address is required' })
    .max(200, { message: 'Address must be less than 200 characters' }),
  mapUrl: z.string().url({ message: 'Invalid map URL' }).optional(),
  websiteUrl: z.string().url({ message: 'Invalid website URL' }).optional(),
  contactPhone: z
    .string()
    .regex(/^0\d{1,4}-\d{1,4}-\d{4}$/, { message: 'Invalid phone number format (例: 028-123-4567)' }),
  gallery: z.array(z.string().url()).optional(),
});

// ========================================
// Service (サービス・料金メニュー) スキーマ
// ========================================

/**
 * サービス作成スキーマ
 */
export const createServiceSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Service name is required' })
    .max(100, { message: 'Service name must be less than 100 characters' }),
  description: z
    .string()
    .max(1000, { message: 'Description must be less than 1000 characters' })
    .optional(),
  price: z
    .number()
    .positive({ message: 'Price must be positive' })
    .max(99999999.99, { message: 'Price exceeds maximum value' }),
  unit: z
    .string()
    .min(1, { message: 'Unit is required' })
    .max(50, { message: 'Unit must be less than 50 characters' }),
  duration: z.number().int().positive().optional(),
  isActive: z.boolean().optional().default(true),
});

/**
 * サービス更新スキーマ
 */
export const updateServiceSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Service name is required' })
    .max(100, { message: 'Service name must be less than 100 characters' })
    .optional(),
  description: z
    .string()
    .max(1000, { message: 'Description must be less than 1000 characters' })
    .optional(),
  price: z
    .number()
    .positive({ message: 'Price must be positive' })
    .max(99999999.99, { message: 'Price exceeds maximum value' })
    .optional(),
  unit: z
    .string()
    .min(1, { message: 'Unit is required' })
    .max(50, { message: 'Unit must be less than 50 characters' })
    .optional(),
  duration: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

// ========================================
// 型エクスポート
// ========================================

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type GetVendorsQuery = z.infer<typeof getVendorsQuerySchema>;
export type VendorProfileInput = z.infer<typeof vendorProfileSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
