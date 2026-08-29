import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { RegisterData, UserPermission } from "../../types/auth";

interface RegisterPageProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
  redirectAfterRegister?: string;
}

export function RegisterPage({ onBack, onSwitchToLogin, redirectAfterRegister }: RegisterPageProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    role: 'client',
    permissions: ['buy_products']
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [wantToSell, setWantToSell] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePermissionChange = (permission: UserPermission, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (formData.permissions.length === 0) {
      setError('Veuillez sélectionner au moins un type de compte');
      return;
    }

    if (wantToSell && !storeName.trim()) {
      setError('Le nom de la boutique est requis pour candidater en tant que vendeur');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      if (wantToSell) {
        const { api } = await import('../../api/client');
        await api.post('/vendors/apply/', {
          storeName: storeName.trim(),
          description: storeDescription.trim(),
        });
      }
      if (redirectAfterRegister === 'checkout') {
        window.location.href = '#checkout';
        setTimeout(() => onBack(), 100);
      } else {
        onBack();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Créer un compte</CardTitle>
            <p className="text-sm text-muted-foreground">
              Rejoignez la communauté AraMarket
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" role="alert" aria-live="assertive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Jean Dupont"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Type de compte</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="buy_products"
                      checked={formData.permissions.includes('buy_products')}
                      onCheckedChange={(checked) => 
                        handlePermissionChange('buy_products', checked as boolean)
                      }
                    />
                    <Label htmlFor="buy_products" className="text-sm cursor-pointer">
                      Acheteur - Je souhaite acheter des produits
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sell_products"
                      checked={formData.permissions.includes('sell_products') || wantToSell}
                      onCheckedChange={(checked) => {
                        const next = checked as boolean;
                        setWantToSell(next);
                        if (next) {
                          handlePermissionChange('sell_products', true);
                        } else {
                          handlePermissionChange('sell_products', false);
                        }
                      }}
                    />
                    <Label htmlFor="sell_products" className="text-sm cursor-pointer">
                      Vendeur - Je souhaite vendre mes produits
                    </Label>
                  </div>
                </div>
              </div>

              {wantToSell && (
                <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nom de boutique</Label>
                    <Input
                      id="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Atelier Lune"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Description</Label>
                    <Input
                      id="storeDescription"
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      placeholder="Maison de décoration / mode / artisanat"
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Création du compte...' : 'Créer mon compte'}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="mb-4" />
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Déjà un compte ?
                </p>
                <Button
                  variant="outline"
                  onClick={onSwitchToLogin}
                  className="w-full"
                >
                  Se connecter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}