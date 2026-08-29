import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProductSearch } from "./useProductSearch";
import type { Product } from "../types/product";

const products = [
  { id: "1", name: "Casque", description: "Audio", category: "Tech", vendorName: "A", vendorId: "a", price: 20, inStock: true, rating: 4, reviewCount: 2, dateAdded: new Date("2024-01-01"), isBestSeller: false, isOnSale: false, image: "" },
  { id: "2", name: "Lampe", description: "Maison", category: "Home", vendorName: "B", vendorId: "b", price: 10, inStock: false, rating: 5, reviewCount: 3, dateAdded: new Date("2024-02-01"), isBestSeller: true, isOnSale: false, image: "" },
] as Product[];

describe("useProductSearch", () => {
  it("filters text and stock and sorts by price", () => {
    const { result } = renderHook(() => useProductSearch(products, { query: "a", inStock: true, sortBy: "price-low" }));
    expect(result.current.map(product => product.id)).toEqual(["1"]);
  });
});
