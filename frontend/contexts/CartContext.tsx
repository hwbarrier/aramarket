import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "../components/ProductCard";
import { CartContextValue, CartItem } from "../types/cart";
import { useAuth } from "./AuthContext";

const CART_KEY_PREFIX = "aramarket_cart_";
const GUEST_CART_KEY = `${CART_KEY_PREFIX}guest`;
const CartContext = createContext<CartContextValue | undefined>(undefined);

function storageKey(userId?: string) {
  return userId ? `${CART_KEY_PREFIX}${userId}` : GUEST_CART_KEY;
}

function readCart(key: string): CartItem[] {
  try {
    const value = localStorage.getItem(key);
    if (!value) return [];
    const items = JSON.parse(value) as Partial<CartItem>[];
    return items.filter(item => item.productId && item.vendorId).map(item => ({
      productId: item.productId!,
      name: item.name || "Produit",
      price: Number(item.price) || 0,
      image: item.image || "",
      quantity: Math.max(1, Number(item.quantity) || 1),
      category: item.category || "",
      vendorId: item.vendorId!,
      vendorName: item.vendorName || "Boutique",
      subtotal: 0,
    })).map(item => ({ ...item, subtotal: item.price * item.quantity }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { authState } = useAuth();
  const userId = authState.user?.id;
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const guestItems = readCart(GUEST_CART_KEY);
    const userItems = readCart(storageKey(userId));
    const initialItems = userId && guestItems.length > 0
      ? [...userItems, ...guestItems].reduce<CartItem[]>((merged, item) => {
          const existing = merged.find(existingItem => existingItem.productId === item.productId);
          if (existing) {
            existing.quantity += item.quantity;
            existing.subtotal = existing.price * existing.quantity;
          } else {
            merged.push(item);
          }
          return merged;
        }, [])
      : userItems;

    setItems(initialItems);
    setIsLoading(false);
    if (userId && guestItems.length > 0) localStorage.removeItem(GUEST_CART_KEY);
  }, [userId]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem(storageKey(userId), JSON.stringify(items));
  }, [items, isLoading, userId]);

  const value = useMemo<CartContextValue>(() => {
    const normalizedItems = items.map(item => ({ ...item, subtotal: item.price * item.quantity }));
    const groups = normalizedItems.reduce<CartContextValue["groups"]>((result, item) => {
      const group = result.find(existingGroup => existingGroup.vendorId === item.vendorId);
      if (group) {
        group.items.push(item);
        group.subtotal += item.subtotal;
      } else {
        result.push({ vendorId: item.vendorId, vendorName: item.vendorName, items: [item], subtotal: item.subtotal });
      }
      return result;
    }, []);

    return {
      items: normalizedItems,
      groups,
      itemCount: normalizedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: normalizedItems.reduce((sum, item) => sum + item.subtotal, 0),
      isLoading,
      addItem: (product: Product) => setItems(current => {
        const existing = current.find(item => item.productId === product.id);
        if (existing) {
          return current.map(item => item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: item.price * (item.quantity + 1) }
            : item);
        }
        return [...current, {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          category: product.category,
          vendorId: product.vendorId,
          vendorName: product.vendorName,
          subtotal: product.price,
        }];
      }),
      updateQuantity: (productId: string, quantity: number) => setItems(current => quantity <= 0
        ? current.filter(item => item.productId !== productId)
        : current.map(item => item.productId === productId
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item)),
      removeItem: (productId: string) => setItems(current => current.filter(item => item.productId !== productId)),
      clearCart: () => setItems([]),
    };
  }, [isLoading, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
