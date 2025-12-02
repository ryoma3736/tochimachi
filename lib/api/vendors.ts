/**
 * Vendor API functions
 * Client-side API calls for vendor data
 */

import type {
  VendorListParams,
  PaginatedVendorList,
  VendorDetail,
  Category,
} from '@/lib/types/vendor';

const API_BASE = '/api/vendors';

/**
 * Fetch paginated vendor list with filters
 */
export async function getVendors(
  params: VendorListParams = {}
): Promise<PaginatedVendorList> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);

  if (params.filters) {
    if (params.filters.categoryId) searchParams.set('categoryId', params.filters.categoryId);
    if (params.filters.priceMin) searchParams.set('priceMin', params.filters.priceMin.toString());
    if (params.filters.priceMax) searchParams.set('priceMax', params.filters.priceMax.toString());
    if (params.filters.area) searchParams.set('area', params.filters.area);
    if (params.filters.hasInstagram !== undefined)
      searchParams.set('hasInstagram', params.filters.hasInstagram.toString());
    if (params.filters.search) searchParams.set('search', params.filters.search);
  }

  const url = `${API_BASE}?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch vendors: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch vendor detail by ID
 */
export async function getVendorById(id: string): Promise<VendorDetail> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch vendor: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Add service to cart (inquiry)
 */
export async function addToCart(serviceId: string, quantity: number = 1): Promise<void> {
  const response = await fetch('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ serviceId, quantity }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add to cart: ${response.statusText}`);
  }
}

/**
 * Get unique areas from vendors
 */
export async function getAreas(): Promise<string[]> {
  const response = await fetch('/api/vendors/areas');

  if (!response.ok) {
    throw new Error(`Failed to fetch areas: ${response.statusText}`);
  }

  return response.json();
}
