import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowLeft, MapPin, ShieldCheck, Star, Store } from "lucide-react";
import type { Vendor } from "../../types/vendor";

interface VendorProfileProps {
  vendor: Vendor;
  onBack: () => void;
}

export function VendorProfile({ vendor, onBack }: VendorProfileProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="relative h-44 bg-muted sm:h-56">
        <ImageWithFallback src={vendor.coverImage || vendor.logo || ""} alt="" className="h-full w-full object-cover" />
        <Button variant="secondary" size="sm" className="absolute left-4 top-4 gap-2" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Retour</Button>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:p-8">
        <ImageWithFallback src={vendor.logo || ""} alt={vendor.name} className="-mt-16 h-28 w-28 rounded-2xl border-4 border-card object-cover shadow-lg sm:-mt-20" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{vendor.shopName || vendor.name}</h1>
            {vendor.isVerified && <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-4 w-4" /> Vendeur verifie</Badge>}
          </div>
          <p className="mt-2 max-w-2xl text-muted-foreground">{vendor.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {vendor.rating?.toFixed(1)} ({vendor.reviewCount} avis)</span>
            <span className="flex items-center gap-1"><Store className="h-4 w-4" /> {vendor.productCount} produits</span>
            {vendor.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {vendor.location}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
