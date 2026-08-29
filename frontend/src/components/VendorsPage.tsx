import { useEffect, useState } from "react";
import { Search, Store } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { VendorCard } from "./vendor/VendorCard";
import { vendorService } from "../services/vendor.service";
import type { Vendor } from "../types/vendor";
import { useVendorSearch, VendorSort } from "../hooks/useVendorSearch";
import { EmptyState, ErrorState, LoadingState } from "./common/AsyncState";

interface VendorsPageProps { onOpenVendor: (vendorId: string) => void; }

export function VendorsPage({ onOpenVendor }: VendorsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const query = searchParams.get("q") || "";
  const sortBy = (searchParams.get("sort") || "name") as VendorSort;

  useEffect(() => {
    let active = true;
    vendorService.getPublicVendors().then((data) => {
      if (!active) return;
      setVendors(data);
    }).catch(() => {
      if (active) setError(true);
    }).finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  const filteredVendors = useVendorSearch(vendors, { query, sortBy });
  const updateQuery = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("q", value); else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-8">
      <header className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-10">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/70">Le guide des boutiques</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Trouvez votre prochaine adresse preferee.</h1>
          <p className="mt-3 text-primary-foreground/80">Des vendeurs independants, des savoir-faire locaux et des produits choisis avec soin.</p>
        </div>
        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Rechercher une boutique..." aria-label="Rechercher une boutique" className="h-12 border-0 bg-background pl-10 text-foreground" />
        </div>
      </header>
      <div className="flex items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold">Boutiques populaires</h2><p className="text-muted-foreground">{filteredVendors.length} boutique{filteredVendors.length > 1 ? "s" : ""} a decouvrir</p></div>
        <Store className="h-8 w-8 text-primary" />
      </div>
      {isLoading ? <LoadingState /> : error ? <ErrorState message="Impossible de contacter le serveur." onRetry={() => window.location.reload()} /> : filteredVendors.length === 0 ? <EmptyState message="Aucune boutique ne correspond à votre recherche." /> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{filteredVendors.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} onOpen={onOpenVendor} />)}</div>}
    </div>
  );
}
