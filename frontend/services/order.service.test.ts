import { describe, expect, it } from "vitest";
import { calculateVendorSuborders } from "./order.service";
import type { OrderItem } from "../types/order";

const item = (vendorId: string, total: number): OrderItem => ({ id: `${vendorId}-${total}`, productId: "p", productName: "Produit", productImage: "", price: total, quantity: 1, total, vendorId, vendorName: vendorId });

describe("calculateVendorSuborders", () => {
  it("groups items and calculates each vendor subtotal", () => {
    const result = calculateVendorSuborders([item("a", 10), item("a", 5), item("b", 7)]);
    expect(result).toHaveLength(2);
    expect(result.find(group => group.vendorId === "a")?.subtotal).toBe(15);
    expect(result.find(group => group.vendorId === "b")?.subtotal).toBe(7);
  });
});
