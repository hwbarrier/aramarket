import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useVendorSearch } from "./useVendorSearch";
import type { Vendor } from "../types/vendor";

const vendors: Vendor[] = [
  { id: "1", name: "Alpha", shopName: "Alpha Shop", location: "Lome", rating: 4, productCount: 5, isVerified: true },
  { id: "2", name: "Beta", shopName: "Beta Shop", location: "Kara", rating: 5, productCount: 2, isVerified: false },
];

describe("useVendorSearch", () => {
  it("filters by query/location and verified status", () => {
    const { result } = renderHook(() => useVendorSearch(vendors, { query: "alpha", location: "lome", verifiedOnly: true }));
    expect(result.current.map(vendor => vendor.id)).toEqual(["1"]);
  });

  it("sorts vendors by rating", () => {
    const { result } = renderHook(() => useVendorSearch(vendors, { sortBy: "rating" }));
    expect(result.current.map(vendor => vendor.id)).toEqual(["2", "1"]);
  });
});
