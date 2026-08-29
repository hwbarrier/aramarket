import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

export function BecomeVendorPage() {
  const { authState } = useAuth();
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!authState.isAuthenticated) {
      setError("Connectez-vous pour envoyer votre candidature vendeur.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/vendors/apply/", {
        storeName,
        description,
      });
      const payload = response.data;
      const message = payload?.message || "Votre demande a bien été envoyée.";
      setSuccess(message);
      setStoreName("");
      setDescription("");
    } catch (submitError: any) {
      const backendMessage = submitError?.response?.data?.message || "Impossible d'envoyer la candidature pour le moment.";
      setError(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const alreadyVendor = authState.user?.role === "vendor";

  return (
    <div className="mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Devenir vendeur sur AraMarket</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Lancez votre boutique, exposez vos produits et rejoignez la marketplace locale.
              </p>
            </div>
            {alreadyVendor && (
              <Badge variant="secondary">Candidature déjà reçue</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {!authState.isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Vous devez être connecté pour présenter votre boutique. Créez un compte client, puis envoyez votre candidature vendeur.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => window.location.href = "/login"}>Se connecter</Button>
                <Button variant="outline" onClick={() => window.location.href = "/register"}>Créer un compte</Button>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="storeName">Nom de la boutique</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(event) => setStoreName(event.target.value)}
                  placeholder="Maison Elia / Atelier Nordic"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Présentation de votre boutique</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Décrivez votre univers, vos catégories, votre style de vente et vos avantages clients."
                  rows={6}
                />
              </div>

              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Le statut de la boutique passera en <strong>pending</strong> après validation par l&apos;admin.
                Une fois approuvée, la boutique est visible dans le catalogue public et le dashboard vendeur devient actif.
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer la candidature"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
