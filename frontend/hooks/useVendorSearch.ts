import { useMemo } from "react";
import type { Vendor } from "../types/vendor";

export type VendorSort = "name" | "rating" | "products";

export interface VendorSearchOptions {
  query?: string;
  location?: string;
  verifiedOnly?: boolean;
  sortBy?: VendorSort;
}

export function useVendorSearch(vendors: Vendor[], options: VendorSearchOptions = {}) {
  return useMemo(() => {
    const query = (options.query || "").trim().toLowerCase();
    const location = (options.location || "").trim().toLowerCase();
    return [...vendors]
      .filter(vendor => {
        const haystack = `${vendor.name} ${vendor.shopName || ""} ${vendor.description || ""} ${vendor.location || ""}`.toLowerCase();
        return (!query || haystack.includes(query))
          && (!location || (vendor.location || "").toLowerCase().includes(location))
          && (!options.verifiedOnly || vendor.isVerified);
      })
      .sort((a, b) => {
        switch (options.sortBy) {
          case "rating": return (b.rating || 0) - (a.rating || 0);
          case "products": return (b.productCount || 0) - (a.productCount || 0);
          default: return (a.shopName || a.name).localeCompare(b.shopName || b.name);
        }
      });
  }, [options.location, options.query, options.sortBy, options.verifiedOnly, vendors]);
}
