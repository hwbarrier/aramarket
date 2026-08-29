import { useMemo } from "react";
import { Product } from "../types/product";

export type ProductSort = "name" | "price-low" | "price-high" | "newest" | "popularity" | "rating";

interface ProductSearchOptions {
  query?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  vendorId?: string;
  inStock?: boolean;
  sortBy?: ProductSort;
}

export function useProductSearch(products: Product[], options: ProductSearchOptions) {
  return useMemo(() => {
    const query = (options.query || "").toLowerCase().trim();
    return [...products].filter(product => {
      const haystack = `${product.name} ${product.description || ""} ${product.category} ${product.vendorName} ${product.brand || ""}`.toLowerCase();
      return (!query || haystack.includes(query))
        && (!options.categories?.length || options.categories.includes(product.category))
        && (options.minPrice === undefined || product.price >= options.minPrice)
        && (options.maxPrice === undefined || product.price <= options.maxPrice)
        && (!options.vendorId || product.vendorId === options.vendorId)
        && (!options.inStock || product.inStock);
    }).sort((a, b) => {
      switch (options.sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "newest": return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case "popularity": return Number(b.isBestSeller) - Number(a.isBestSeller) || b.reviewCount - a.reviewCount;
        case "rating": return b.rating - a.rating;
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [options.categories, options.inStock, options.maxPrice, options.minPrice, options.query, options.sortBy, options.vendorId, products]);
}
