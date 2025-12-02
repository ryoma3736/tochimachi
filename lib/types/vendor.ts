/**
 * Vendor related type definitions
 * Maps to Prisma schema models
 */

export interface Vendor {
  id: string;
  companyName: string;
  categoryId: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  category: Category;
  profile?: VendorProfile;
  services: Service[];
  instagramAccount?: InstagramAccount;
}

export interface VendorProfile {
  id: string;
  vendorId: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  businessHours?: Record<string, string>; // {"mon": "9:00-18:00", ...}
  address: string;
  mapUrl?: string;
  websiteUrl?: string;
  contactPhone: string;
  gallery?: string[]; // ["url1", "url2", ...]
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  displayOrder: number;
}

export interface Service {
  id: string;
  vendorId: string;
  name: string;
  description?: string;
  price: number;
  unit: string; // "1時間", "1回", etc.
  duration?: number; // minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstagramAccount {
  id: string;
  vendorId: string;
  instagramUsername: string;
  lastSyncAt?: Date;
  syncedPosts?: InstagramPost[];
  isActive: boolean;
}

export interface InstagramPost {
  id: string;
  caption?: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  timestamp: string;
  likeCount?: number;
}

/**
 * API Response types
 */

export interface VendorListItem {
  id: string;
  companyName: string;
  category: {
    name: string;
    slug: string;
  };
  logoUrl?: string;
  coverImageUrl?: string;
  priceRange: {
    min: number;
    max: number;
  };
  address: string;
  instagramUsername?: string;
  serviceCount: number;
}

export interface VendorDetail extends Vendor {
  profile: VendorProfile;
  services: Service[];
  instagramAccount?: InstagramAccount & {
    posts: InstagramPost[];
  };
}

/**
 * Filter and Sort types
 */

export interface VendorFilters {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  area?: string;
  hasInstagram?: boolean;
  search?: string;
}

export type VendorSortBy =
  | 'displayOrder'
  | 'companyName'
  | 'priceAsc'
  | 'priceDesc'
  | 'newest';

export interface VendorListParams {
  page?: number;
  pageSize?: number;
  filters?: VendorFilters;
  sortBy?: VendorSortBy;
}

export interface PaginatedVendorList {
  vendors: VendorListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
