import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Minus, Plus, Trash2, ShoppingBag, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useLocalization } from "../contexts/LocalizationContext";

interface CartPageProps {
  onPageChange: (page: string) => void;
}

export function CartPage({ onPageChange }: CartPageProps) {
  const { authState } = useAuth();
  const { groups, items, subtotal, updateQuantity, removeItem, isLoading } = useCart();
  const { formatPrice } = useLocalization();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = () => onPageChange(authState.isAuthenticated ? "checkout" : "login");

  if (isLoading) return <div className="py-16 text-center text-muted-foreground">Chargement du panier...</div>;

  if (items.length === 0) {
    return (
      <div className="text-center py-8 md:py-12 px-4">
        <ShoppingBag className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Votre panier est vide</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">Ajoutez des produits pour commencer votre commande.</p>
        <Button onClick={() => onPageChange("products")} size="lg">Commencer mes achats</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8" aria-label="Panier">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader><CardTitle className="text-lg md:text-xl">Panier ({items.length} {items.length === 1 ? "article" : "articles"})</CardTitle></CardHeader>
          <CardContent className="space-y-4 p-0 md:p-6">
            {groups.map(group => (
              <section key={group.vendorId} aria-labelledby={`vendor-${group.vendorId}`} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between px-3 md:px-0 py-3">
                  <h3 id={`vendor-${group.vendorId}`} className="font-semibold text-primary">{group.vendorName}</h3>
                  <span className="text-sm font-medium">{formatPrice(group.subtotal)}</span>
                </div>
                {group.items.map(item => (
                  <div key={item.productId} className="flex gap-3 md:gap-4 p-3 md:p-4 border-t md:border md:rounded-lg">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 flex-1 mr-2">
                          <h4 className="line-clamp-2 text-sm md:text-base font-medium">{item.name}</h4>
                          <Badge variant="outline" className="text-xs mt-1">{item.category}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)} aria-label="Supprimer l'article" className="text-destructive hover:text-destructive flex-shrink-0 h-8 w-8 md:h-10 md:w-10"><Trash2 className="h-3 w-3 md:h-4 md:w-4" /></Button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 md:gap-2">
                          <Button variant="outline" size="icon" aria-label="Diminuer la quantité" className="h-7 w-7 md:h-8 md:w-8" onClick={() => updateQuantity(item.productId, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                          <span className="w-6 md:w-8 text-center text-sm md:text-base">{item.quantity}</span>
                          <Button variant="outline" size="icon" aria-label="Augmenter la quantité" className="h-7 w-7 md:h-8 md:w-8" onClick={() => updateQuantity(item.productId, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                        <div className="text-right min-w-0 flex-shrink-0"><p className="font-semibold text-sm md:text-base">{formatPrice(item.subtotal)}</p><p className="text-xs md:text-sm text-muted-foreground">{formatPrice(item.price)} / unité</p></div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader><CardTitle className="text-lg md:text-xl">Résumé de commande</CardTitle></CardHeader>
          <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
            <div className="flex justify-between text-sm md:text-base"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-sm md:text-base"><span>Livraison</span><span>{shipping === 0 ? <Badge variant="secondary">Gratuite</Badge> : formatPrice(shipping)}</span></div>
            <Separator />
            <div className="flex justify-between font-semibold text-base md:text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
            {shipping > 0 && <p className="text-xs md:text-sm text-muted-foreground text-center">Ajoutez {formatPrice(50 - subtotal)} pour la livraison gratuite.</p>}
            {!authState.isAuthenticated && <Alert className="py-2 md:py-3"><User className="h-4 w-4" /><AlertDescription className="text-xs md:text-sm">Connectez-vous pour finaliser votre commande.</AlertDescription></Alert>}
            <Button className="w-full" size="lg" onClick={handleCheckout}>{authState.isAuthenticated ? "Passer la commande" : "Se connecter pour commander"}</Button>
            <Button variant="outline" className="w-full" onClick={() => onPageChange("products")}>Continuer mes achats</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
