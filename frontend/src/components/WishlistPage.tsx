import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Trash2, ShoppingCart, Filter, Grid, List } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { cn } from './ui/utils';
import { Product } from './ProductCard';

interface WishlistPageProps {
  onPageChange: (page: string) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (productId: string) => void;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'dateAdded' | 'price' | 'name' | 'category';

export function WishlistPage({ onPageChange, onAddToCart, onViewDetails }: WishlistPageProps) {
  const { wishlistItems, removeFromWishlist, clearWishlist, shareWishlist } = useWishlist();
  const { showToast } = useNotifications();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('dateAdded');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrer et trier les articles
  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = wishlistItems.filter(item => {
      if (selectedCategory === 'all') return true;
      return item.product?.category === selectedCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dateAdded':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'price':
          return (a.product?.price || 0) - (b.product?.price || 0);
        case 'name':
          return (a.product?.name || '').localeCompare(b.product?.name || '');
        case 'category':
          return (a.product?.category || '').localeCompare(b.product?.category || '');
        default:
          return 0;
      }
    });
  }, [wishlistItems, selectedCategory, sortBy]);

  // Obtenir les catégories uniques
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(wishlistItems.map(item => item.product?.category).filter(Boolean))];
    return uniqueCategories;
  }, [wishlistItems]);

  const handleShare = async () => {
    await shareWishlist();
  };

  const handleClearAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre liste de souhaits ?')) {
      clearWishlist();
    }
  };

  const calculateTotal = () => {
    return filteredAndSortedItems.reduce((total, item) => total + (item.product?.price || 0), 0);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Démo locale uniquement :</strong> la wishlist est présentée en interface de démonstration et n&apos;est pas synchronisée avec le backend productif.
        </div>
        <div className="text-center py-12">
          <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-medium mb-2">Votre liste de souhaits est vide</h2>
          <p className="text-muted-foreground mb-6">
            Découvrez nos produits et ajoutez vos favoris à votre liste de souhaits
          </p>
          <Button onClick={() => onPageChange('products')}>
            Découvrir les produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Démo locale uniquement :</strong> cette wishlist reflète la maquette du produit, sans persistance backend ni partage utilisateur réel.
      </div>
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-medium mb-2">Ma liste de souhaits</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedItems.length} produit(s) dans votre liste
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          
          {wishlistItems.length > 1 && (
            <Button variant="outline" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Tout vider
            </Button>
          )}
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtre par catégorie */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedCategory === 'all' ? 'Toutes les catégories' : selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                Toutes les catégories
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tri */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Trier par: {
                  sortBy === 'dateAdded' ? 'Date d\'ajout' :
                  sortBy === 'price' ? 'Prix' :
                  sortBy === 'name' ? 'Nom' : 'Catégorie'
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('dateAdded')}>
                Date d'ajout
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('price')}>
                Prix
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Nom
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('category')}>
                Catégorie
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode d'affichage */}
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Résumé */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valeur totale estimée</p>
              <p className="text-2xl font-medium">{calculateTotal().toFixed(2)} €</p>
            </div>
            <Button
              onClick={() => {
                // Ajouter tous les produits au panier
                filteredAndSortedItems.forEach(item => {
                  if (item.product && item.product.inStock) {
                    onAddToCart(item.product);
                  }
                });
                showToast({
                  title: '🛒 Produits ajoutés',
                  description: 'Tous les produits disponibles ont été ajoutés au panier',
                  type: 'success'
                });
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Tout ajouter au panier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      )}>
        <AnimatePresence>
          {filteredAndSortedItems.map((item, index) => {
            const product = item.product;
            if (!product) return null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardContent className={cn(
                    "p-4",
                    viewMode === 'list' && "flex items-center gap-4"
                  )}>
                    <div className={cn(
                      "relative",
                      viewMode === 'grid' ? "aspect-square mb-4" : "flex-shrink-0 w-24 h-24"
                    )}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded cursor-pointer"
                        onClick={() => onViewDetails(product.id)}
                      />
                      
                      {product.isOnSale && (
                        <Badge 
                          variant="destructive" 
                          className="absolute top-2 left-2 text-xs"
                        >
                          Promo
                        </Badge>
                      )}

                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                          <Badge variant="secondary">Rupture</Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 
                        className="font-medium mb-1 cursor-pointer hover:text-primary"
                        onClick={() => onViewDetails(product.id)}
                      >
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.category}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-medium">{product.price.toFixed(2)} €</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice.toFixed(2)} €
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground mb-3">
                        Ajouté le {new Date(item.dateAdded).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div className={cn(
                      "flex gap-2",
                      viewMode === 'grid' ? "w-full" : "flex-col"
                    )}>
                      <Button
                        size="sm"
                        disabled={!product.inStock}
                        onClick={() => onAddToCart(product)}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredAndSortedItems.length === 0 && selectedCategory !== 'all' && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Aucun produit trouvé dans la catégorie "{selectedCategory}"
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSelectedCategory('all')}
            className="mt-4"
          >
            Voir tous les produits
          </Button>
        </div>
      )}
    </div>
  );
}