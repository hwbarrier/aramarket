import { Product } from "../components/ProductCard";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  vendorId: string;
  vendorName: string;
  subtotal: number;
}

export interface VendorCartGroup {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  groups: VendorCartGroup[];
  itemCount: number;
  subtotal: number;
}

export interface CartContextValue extends Cart {
  isLoading: boolean;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}
