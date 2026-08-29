import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { VendorProfile } from "./vendor/VendorProfile";
import { VendorProducts } from "./vendor/VendorProducts";
import { vendorService } from "../services/vendor.service";
import type { Product } from "../types/product";
import type { Vendor } from "../types/vendor";
import { ReviewSection } from "./ReviewSection";

interface VendorStorePageProps {
  vendorId: string;
  products: Product[];
  onBack: () => void;
  onViewDetails: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onViewVendor: (vendorId: string) => void;
}

export function VendorStorePage({ vendorId, products, onBack, onViewDetails, onAddToCart, onViewVendor }: VendorStorePageProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [vendorProducts, setVendorProducts] = useState<Product[]>(products.filter((product) => product.vendorId === vendorId));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([vendorService.getVendor(vendorId), vendorService.getVendorProducts(vendorId)]).then(([vendorResponse, productsResponse]) => {
      if (!active) return;
      const vendorPayload = vendorResponse.data;
      const productPayload = productsResponse.data;
      setVendor("data" in vendorPayload ? vendorPayload.data : vendorPayload);
      setVendorProducts("results" in productPayload ? productPayload.results : "data" in productPayload ? productPayload.data : vendorProducts);
    }).finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, [vendorId, products]);

  if (isLoading) return <div className="space-y-6"><div className="h-56 animate-pulse rounded-2xl bg-muted" /><div className="h-8 w-48 animate-pulse rounded bg-muted" /><div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-80 animate-pulse rounded-xl bg-muted" />)}</div></div>;
  if (!vendor) return <div className="flex flex-col items-center gap-4 py-20 text-center"><AlertCircle className="h-10 w-10 text-destructive" /><p>Cette boutique est introuvable.</p><Button onClick={onBack}>Retour aux boutiques</Button></div>;

  return <div className="space-y-8"><VendorProfile vendor={{ ...vendor, productCount: vendorProducts.length }} onBack={onBack} /><section className="space-y-4"><div><h2 className="text-2xl font-bold">Les produits de la boutique</h2><p className="text-muted-foreground">Une selection expediee par {vendor.shopName || vendor.name}</p></div><VendorProducts products={vendorProducts} onViewDetails={onViewDetails} onAddToCart={onAddToCart} onViewVendor={onViewVendor} /></section><ReviewSection targetType="vendor" targetId={vendor.id} /></div>;
}
