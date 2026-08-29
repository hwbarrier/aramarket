export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[]; // Gallery d'images
  rating: number;
  reviewCount: number;
  category: string;
  categoryId?: string;
  subCategory?: string;
  brand?: string;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  inStock: boolean;
  stockQuantity?: number;
  isOnSale: boolean;
  saleEndDate?: Date;
  tags?: string[];
  vendorId: string;
  vendorName: string;
  vendor?: Pick<Vendor, 'id' | 'name' | 'shopName' | 'logo' | 'rating' | 'isVerified'>;
  shippingInfo?: {
    freeShipping: boolean;
    estimatedDays: number;
    cost?: number;
  };
  dimensions?: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  sku?: string;
  barcode?: string;
  dateAdded: Date;
  dateUpdated?: Date;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

import type { Vendor } from './vendor';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isHelpful: number;
  isNotHelpful: number;
  dateCreated: Date;
  vendorResponse?: {
    message: string;
    date: Date;
  };
}

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  dateAdded: Date;
  product?: Product;
}

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  brand?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
  tags?: string[];
}

export interface SearchParams {
  query: string;
  filters?: ProductFilters;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'popularity';
  page?: number;
  limit?: number;
}

export interface ProductSearchResult {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: {
    categories: Array<{ name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
    priceRange: { min: number; max: number };
  };
}