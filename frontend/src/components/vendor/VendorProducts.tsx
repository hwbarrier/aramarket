import { ProductCard } from "../ProductCard";
import type { Product } from "../../types/product";

interface VendorProductsProps {
  products: Product[];
  onViewDetails: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onViewVendor: (vendorId: string) => void;
}

export function VendorProducts({ products, onViewDetails, onAddToCart, onViewVendor }: VendorProductsProps) {
  if (products.length === 0) {
    return <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">Cette boutique ne propose aucun produit pour le moment.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} onAddToCart={onAddToCart} onViewVendor={onViewVendor} />)}
    </div>
  );
}
