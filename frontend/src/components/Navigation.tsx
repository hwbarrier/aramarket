import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  LogIn, 
  LogOut, 
  Heart, 
  Bell, 
  MessageSquare,
  MapPin,
  ChevronDown,
  Globe,
  Truck,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "./ui/sheet";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { LocalizationSelector } from "./LocalizationSelector";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useMessages } from "../contexts/MessageContext";
import { useState } from "react";
import { Product } from "./ProductCard";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartItemCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products?: Product[];
}

export function Navigation({ 
  currentPage, 
  onPageChange, 
  cartItemCount, 
  searchQuery, 
  onSearchChange,
  products = []
}: NavigationProps) {
  const { authState, logout, hasPermission, hasRole } = useAuth();
  const { requestNotificationPermission, notificationPermission, notifications, markNotificationRead, markAllNotificationsRead } = useNotifications();
  const { wishlistItems } = useWishlist();
  const { getUnreadCount } = useMessages();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Catégories principales
  const mainCategories = [
    { id: 'electronics', label: 'Électronique', subcategories: ['Smartphones', 'Ordinateurs', 'Audio'] },
    { id: 'fashion', label: 'Mode', subcategories: ['Homme', 'Femme', 'Enfant'] },
    { id: 'home', label: 'Maison', subcategories: ['Meubles', 'Décoration', 'Cuisine'] },
    { id: 'sports', label: 'Sports', subcategories: ['Fitness', 'Vêtements', 'Équipement'] },
    { id: 'beauty', label: 'Beauté', subcategories: ['Soins', 'Maquillage', 'Parfums'] },
    { id: 'toys', label: 'Jouets', subcategories: ['Éducatifs', 'Jeux', 'Peluches'] },
  ];

  // Catégories de tendances (5 premières)
  const trendingCategories = mainCategories.slice(0, 5);

  const handleCategorySelect = (categoryId: string) => {
    onPageChange('products');
    setIsMobileMenuOpen(false);
  };

  const MobileMenuContent = () => (
    <div className="space-y-4">
      {/* En-tête du menu mobile */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            {authState.isAuthenticated ? (
              <>
                <p className="font-medium text-sm">Bonjour, {authState.user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-muted-foreground">{authState.user?.email}</p>
              </>
            ) : (
              <p className="font-medium text-sm">Bienvenue</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation principale */}
      <nav className="space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-base h-12 font-medium"
          onClick={() => { onPageChange('home'); setIsMobileMenuOpen(false); }}
        >
          🏠 Accueil
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-base h-12 font-medium"
          onClick={() => { onPageChange('products'); setIsMobileMenuOpen(false); }}
        >
          📦 Tous les produits
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-base h-12 font-medium"
          onClick={() => { onPageChange('vendors'); setIsMobileMenuOpen(false); }}
        >
          🏪 Boutiques partenaires
        </Button>
      </nav>

      {/* Séparateur */}
      <div className="border-t" />

      {/* Catégories */}
      <div>
        <h3 className="font-semibold text-sm text-muted-foreground mb-3 px-2">Catégories</h3>
        <div className="space-y-1">
          {mainCategories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className="w-full justify-start text-sm h-10 px-4"
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t" />

      {/* Compte utilisateur */}
      {authState.isAuthenticated ? (
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-base h-12 font-medium"
            onClick={() => { onPageChange('profile'); setIsMobileMenuOpen(false); }}
          >
            👤 Mon compte
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-base h-12 font-medium"
            onClick={() => { onPageChange('wishlist'); setIsMobileMenuOpen(false); }}
          >
            ❤️ Favoris (démo locale)
            {wishlistItems.length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {wishlistItems.length}
              </Badge>
            )}
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-base h-12 font-medium"
            onClick={() => { onPageChange('become-vendor'); setIsMobileMenuOpen(false); }}
          >
            🏬 Devenir vendeur
          </Button>
           
          <Button 
            variant="ghost" 
            className="w-full justify-start text-base h-12 font-medium"
            onClick={() => { onPageChange('messaging'); setIsMobileMenuOpen(false); }}
          >
            💬 Messages (démo locale)
            {getUnreadCount() > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {getUnreadCount()}
              </Badge>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-base h-12 font-medium text-destructive"
            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
          >
            🚪 Déconnexion
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Button 
            className="w-full h-12 font-medium"
            onClick={() => { onPageChange('login'); setIsMobileMenuOpen(false); }}
          >
            🔐 Connexion
          </Button>
          <Button 
            variant="outline"
            className="w-full h-12 font-medium"
            onClick={() => { onPageChange('register'); setIsMobileMenuOpen(false); }}
          >
            📝 Inscription
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Barre supérieure - Livraison et Langue */}
      <div className="bg-primary text-primary-foreground text-sm">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Livraison Partout</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 whitespace-nowrap">
                <Truck className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Livraison gratuite dès 20.000F</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <LocalizationSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Logo et Menu mobile */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 md:flex-none">
              {/* Logo */}
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent min-w-fit h-auto"
                onClick={() => onPageChange('home')}
              >
                <Logo className="h-8 sm:h-10" />
              </Button>

              {/* Menu Catégories - Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden lg:flex items-center gap-1">
                    <Menu className="h-4 w-4" />
                    <span className="font-medium text-sm">Catégories</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto">
                  {mainCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="cursor-pointer"
                    >
                      {category.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Barre de recherche centrée - Desktop seulement */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-2 md:mx-4 min-w-0">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                onSearch={(query) => {
                  onSearchChange(query);
                  onPageChange('products');
                }}
                products={products}
                className="w-full"
                placeholder="Rechercher des produits, marques..."
              />
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* SUPPRIMÉ: Bouton de recherche mobile */}

              {/* Liste de souhaits - Desktop seulement */}
              {authState.isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange('wishlist')}
                  className="hidden sm:flex flex-col items-center h-auto px-2 py-1 hover:bg-accent hover:text-accent-foreground min-w-12 relative"
                >
                  <Heart className="h-5 w-5" />
                  <span className="text-xs mt-1">Favoris</span>
                  {wishlistItems.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs min-w-4"
                    >
                      {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Panier */}
              {authState.isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative flex flex-col items-center h-auto px-2 py-1">
                      <Bell className="h-5 w-5" /><span className="text-xs mt-1 hidden sm:block">Alertes</span>
                      {notifications.filter(n => !n.read && n.userId === authState.user?.id).length > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 p-0 flex items-center justify-center">{notifications.filter(n => !n.read && n.userId === authState.user?.id).length}</Badge>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="flex justify-between p-2 text-sm font-medium"><span>Notifications</span><button onClick={markAllNotificationsRead} className="text-primary text-xs">Tout lire</button></div>
                    <DropdownMenuSeparator />
                    {notifications.filter(n => n.userId === authState.user?.id).slice(0, 5).map(n => <DropdownMenuItem key={n.id} onClick={() => markNotificationRead(n.id)} className={n.read ? "opacity-60" : ""}><div><p className="font-medium">{n.title}</p><p className="text-xs text-muted-foreground">{n.message}</p></div></DropdownMenuItem>)}
                    {notifications.filter(n => n.userId === authState.user?.id).length === 0 && <p className="p-3 text-sm text-muted-foreground">Aucune notification</p>}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Panier */}
              <Button
                variant="ghost"
                onClick={() => onPageChange('cart')}
                className="flex flex-col items-center h-auto px-2 sm:px-3 py-1 hover:bg-accent hover:text-accent-foreground relative min-w-12 sm:min-w-12 border-l"
              >
                <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
                <span className="text-xs mt-1 hidden sm:block">Panier</span>
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-5"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* Avatar utilisateur - Desktop seulement */}
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex flex-col items-center h-auto px-2 py-1 hover:bg-white bg-accent hover:text-accent-foreground min-w-12"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs mt-1">
                        {authState.isAuthenticated ? 'Compte' : 'Connexion'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {authState.isAuthenticated ? (
                      <>
                        <div className="flex items-center justify-start p-2">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">Bonjour, {authState.user?.name?.split(' ')[0]}</p>
                            <p className="text-xs text-muted-foreground">{authState.user?.email}</p>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onPageChange('profile')}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Mon compte</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPageChange('wishlist')}>
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Mes favoris</span>
                          {wishlistItems.length > 0 && (
                            <Badge variant="destructive" className="ml-auto text-xs">
                              {wishlistItems.length}
                            </Badge>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPageChange('become-vendor')}>
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>Devenir vendeur</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPageChange('messaging')}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Messages</span>
                          {getUnreadCount() > 0 && (
                            <Badge variant="destructive" className="ml-auto text-xs">
                              {getUnreadCount()}
                            </Badge>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Déconnexion</span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => onPageChange('login')}>
                          <LogIn className="mr-2 h-4 w-4" />
                          <span>Connexion</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPageChange('register')}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Inscription</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Menu mobile - À DROITE APRÈS LE PANIER */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="sm:hidden h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96 p-0">
                  <div className="p-6 h-full overflow-y-auto">
                    <MobileMenuContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Barre de recherche mobile - EN DESSOUS DU HEADER */}
          <div className="md:hidden pb-3 pt-2">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onSearch={(query) => {
                onSearchChange(query);
                onPageChange('products');
              }}
              products={products}
              className="w-full"
              placeholder="Rechercher..."
              size="sm"
            />
          </div>
        </div>

        {/* Barre de navigation secondaire - Catégories horizontales */}
        <div className="border-t hidden lg:block">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-start gap-4 overflow-x-auto py-2">
              {/* Menu burger avec toutes les catégories */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap text-sm font-medium hover:text-primary flex items-center gap-1 flex-shrink-0"
                  >
                    <Menu className="h-4 w-4" />
                    <span>Toutes les catégories</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto">
                  {mainCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="cursor-pointer"
                    >
                      {category.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange('vendors')}
                className="whitespace-nowrap text-sm font-medium hover:text-primary flex-shrink-0"
              >
                Boutiques
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange('become-vendor')}
                className="whitespace-nowrap text-sm font-medium hover:text-primary flex-shrink-0"
              >
                Devenir vendeur
              </Button>

              {/* Catégories de tendances (5 premières) */}
              {trendingCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategorySelect(category.id)}
                  className="whitespace-nowrap text-sm font-medium hover:text-primary flex-shrink-0"
                >
                  {category.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}