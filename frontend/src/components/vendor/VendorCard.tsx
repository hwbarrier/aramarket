import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { MapPin, ShieldCheck, Star, Store } from "lucide-react";
import type { Vendor } from "../../types/vendor";
import { useReviews } from "../../hooks/useReviews";

interface VendorCardProps {
  vendor: Vendor;
  onOpen: (vendorId: string) => void;
}

export function VendorCard({ vendor, onOpen }: VendorCardProps) {
  const reviewData = useReviews("vendor", vendor.id);
  const rating = reviewData.reviewCount ? reviewData.averageRating : vendor.rating;
  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl" onClick={() => onOpen(vendor.id)}>
      <div className="h-28 overflow-hidden bg-muted">
        <ImageWithFallback src={vendor.coverImage || vendor.logo || ""} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <CardContent className="relative p-5 pt-0">
        <ImageWithFallback src={vendor.logo || ""} alt={vendor.name} className="-mt-10 mb-3 h-20 w-20 rounded-2xl border-4 border-background object-cover shadow-md" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{vendor.shopName || vendor.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{vendor.description}</p>
          </div>
          {vendor.isVerified && <Badge variant="secondary" className="shrink-0 gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Verifie</Badge>}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 text-foreground"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {rating?.toFixed(1) || "Nouveau"} ({reviewData.reviewCount || vendor.reviewCount || 0})</span>
          <span className="flex items-center gap-1"><Store className="h-4 w-4" /> {vendor.productCount || 0} produits</span>
          {vendor.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {vendor.location}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
