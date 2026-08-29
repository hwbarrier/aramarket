import { FormEvent, useState } from "react";
import { ArrowLeft, CreditCard, DollarSign, Truck } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { useCart } from "../contexts/CartContext";
import { useLocalization } from "../contexts/LocalizationContext";
import { OrderCustomer, PaymentMethod } from "../types/order";

interface CheckoutPageProps {
  onBack: () => void;
  onPlaceOrder: (paymentMethod: PaymentMethod, customer: OrderCustomer) => Promise<void> | void;
}

export function CheckoutPage({ onBack, onPlaceOrder }: CheckoutPageProps) {
  const { groups, items, subtotal, clearCart } = useCart();
  const { formatPrice, t } = useLocalization();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [customer, setCustomer] = useState<OrderCustomer>({ name: "", phone: "", address: "", city: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof OrderCustomer, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "failure">("idle");
  const shipping = subtotal > 50 ? 0 : 5.99;

  const updateCustomer = (field: keyof OrderCustomer, value: string) => setCustomer(current => ({ ...current, [field]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (items.length === 0) return setError("Votre panier est vide.");
    const missingFields = (Object.keys(customer) as Array<keyof OrderCustomer>).reduce<Partial<Record<keyof OrderCustomer, string>>>((result, field) => {
      if (!customer[field].trim()) result[field] = "Ce champ est requis.";
      return result;
    }, {});
    if (Object.keys(missingFields).length > 0) {
      setFieldErrors(missingFields);
      setError("Vérifiez les champs obligatoires.");
      return;
    }
    setFieldErrors({});
    setError("");
    setIsProcessing(true);
    try {
      await onPlaceOrder(paymentMethod, customer);
      clearCart();
      setStatus("success");
    } catch {
      setError("La commande n'a pas pu être créée. Vérifiez votre connexion et réessayez.");
      setStatus("failure");
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "success") {
    return <Card className="mx-auto max-w-xl text-center"><CardHeader><CardTitle>Commande confirmée</CardTitle></CardHeader><CardContent className="space-y-4"><p role="status">Votre commande a été enregistrée avec succès.</p><Button type="button" onClick={onBack}>Retour au panier</Button></CardContent></Card>;
  }
  if (status === "failure") {
    return <Card className="mx-auto max-w-xl text-center"><CardHeader><CardTitle>Échec du paiement</CardTitle></CardHeader><CardContent className="space-y-4"><p role="alert">{error}</p><Button type="button" onClick={() => { setStatus("idle"); setError(""); }}>Réessayer</Button></CardContent></Card>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Button type="button" variant="ghost" size="icon" onClick={onBack} aria-label="Retour au panier"><ArrowLeft className="h-4 w-4" /></Button><h1 className="text-2xl font-bold">{t("checkout.title")}</h1></div>
      {error && <div role="alert" aria-live="assertive" className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader><CardTitle>Informations de livraison</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label htmlFor="customer-name">Nom complet</Label><Input id="customer-name" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "customer-name-error" : undefined} value={customer.name} onChange={event => { updateCustomer("name", event.target.value); setFieldErrors(current => ({ ...current, name: undefined })); }} required />{fieldErrors.name && <p id="customer-name-error" className="text-sm text-destructive" role="alert">{fieldErrors.name}</p>}</div>
            <div><Label htmlFor="customer-phone">Téléphone</Label><Input id="customer-phone" type="tel" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "customer-phone-error" : undefined} value={customer.phone} onChange={event => { updateCustomer("phone", event.target.value); setFieldErrors(current => ({ ...current, phone: undefined })); }} required />{fieldErrors.phone && <p id="customer-phone-error" className="text-sm text-destructive" role="alert">{fieldErrors.phone}</p>}</div>
            <div><Label htmlFor="customer-city">Ville</Label><Input id="customer-city" aria-invalid={Boolean(fieldErrors.city)} aria-describedby={fieldErrors.city ? "customer-city-error" : undefined} value={customer.city} onChange={event => { updateCustomer("city", event.target.value); setFieldErrors(current => ({ ...current, city: undefined })); }} required />{fieldErrors.city && <p id="customer-city-error" className="text-sm text-destructive" role="alert">{fieldErrors.city}</p>}</div>
            <div className="sm:col-span-2"><Label htmlFor="customer-address">Adresse</Label><Input id="customer-address" aria-invalid={Boolean(fieldErrors.address)} aria-describedby={fieldErrors.address ? "customer-address-error" : undefined} value={customer.address} onChange={event => { updateCustomer("address", event.target.value); setFieldErrors(current => ({ ...current, address: undefined })); }} required />{fieldErrors.address && <p id="customer-address-error" className="text-sm text-destructive" role="alert">{fieldErrors.address}</p>}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle>{t("checkout.paymentMethod")}</CardTitle></CardHeader><CardContent><RadioGroup value={paymentMethod} onValueChange={value => setPaymentMethod(value as PaymentMethod)}>
            <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer"><RadioGroupItem value="cash_on_delivery" /><Truck className="h-5 w-5" /><span>Paiement à la livraison</span></label>
            <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer"><RadioGroupItem value="credit_card" /><CreditCard className="h-5 w-5" /><span>Carte bancaire (préparation)</span></label>
            <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer"><RadioGroupItem value="paypal" /><DollarSign className="h-5 w-5" /><span>PayPal (préparation)</span></label>
          </RadioGroup></CardContent></Card>
        </div>
        <Card className="h-fit lg:sticky lg:top-4"><CardHeader><CardTitle>{t("checkout.orderSummary")}</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="space-y-4">{groups.map(group => <div key={group.vendorId}><p className="font-semibold text-primary">{group.vendorName}</p>{group.items.map(item => <div key={item.productId} className="flex justify-between gap-3 text-sm py-1"><span>{item.name} x{item.quantity}</span><span>{formatPrice(item.subtotal)}</span></div>)}</div>)}</div>
          <Separator /><div className="flex justify-between text-sm"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between text-sm"><span>Livraison</span><span>{shipping ? formatPrice(shipping) : "Gratuite"}</span></div><Separator /><div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>{isProcessing ? "Création de la commande..." : t("checkout.placeOrder")}</Button>
        </CardContent></Card>
      </div>
    </form>
  );
}
