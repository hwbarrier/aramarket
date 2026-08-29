/**
 * Image URL utilities for AraMarket frontend
 * Converts relative image URLs from API to absolute URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Convert API image URL to absolute URL
 * If URL is already absolute, returns it as is
 * If URL is relative (/media/...), prepends backend domain
 */
export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '/placeholder-image.svg'; // Fallback
  
  // If already absolute, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If relative, construct absolute URL using API base
  if (imageUrl.startsWith('/')) {
    // Remove /api from API_BASE_URL to get backend root
    const backendRoot = API_BASE_URL.replace('/api', '');
    return backendRoot + imageUrl;
  }
  
  return imageUrl;
}

/**
 * Get the best available image URL from product images array
 * Prioritizes default image, falls back to first image
 */
export function getProductImageUrl(product: any): string {
  // If product has images array with default image
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const defaultImage = product.images.find((img: any) => img.is_default);
    if (defaultImage?.image) {
      return getImageUrl(defaultImage.image);
    }
    return getImageUrl(product.images[0].image);
  }
  
  // Fall back to product.image
  return getImageUrl(product.image);
}
