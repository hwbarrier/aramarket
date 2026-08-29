import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { Star, ShoppingCart, Heart, Eye, Zap } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { useNotifications } from "../contexts/NotificationContext";
import type { Product } from "../types/product";
import { useReviews } from "../hooks/useReviews";
import { getProductImageUrl } from "../utils/imageUrl";
export type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView?: () => void;
  onViewVendor?: (vendorId: string) => void;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ 
  product, 
  onViewDetails, 
  onAddToCart, 
  onQuickView,
  onViewVendor,
  viewMode = 'grid' 
}: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useNotifications();
  const reviewData = useReviews("product", product.id);
  const effectiveRating = reviewData.reviewCount ? reviewData.averageRating : product.rating;
  const effectiveReviewCount = reviewData.reviewCount || product.reviewCount;
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    showToast({
      title: '🛒 Ajouté au panier',
      description: `${product.name} a été ajouté au panier`,
      type: 'success'
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      showToast({
        title: '💔 Retiré des favoris',
        description: `${product.name} retiré de vos favoris`,
        type: 'info'
      });
    } else {
      addToWishlist(product);
      showToast({
        title: '❤️ Ajouté aux favoris',
        description: `${product.name} ajouté à vos favoris`,
        type: 'success'
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.();
  };

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-0">
          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={getProductImageUrl(product)}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                onClick={() => onViewDetails(product.id)}
              />
              {product.isOnSale && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    {product.isBestSeller && (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Bestseller
                      </Badge>
                    )}
                    {product.isNewArrival && (
                      <Badge className="text-xs bg-green-500">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  <h3 
                    className="line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onViewDetails(product.id)}
                  >
                    {product.name}
                  </h3>
                  <button className="text-sm text-primary hover:underline" onClick={() => onViewVendor?.(product.vendorId)}>
                    Vendu par {product.vendorName}
                  </button>
                  {product.brand && (
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleWishlist}
                    className="h-8 w-8 p-0"
                  >
                    <Heart 
                      className={cn(
                        "h-4 w-4",
                        inWishlist && "fill-current text-red-500"
                      )} 
                    />
                  </Button>
                  {onQuickView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleQuickView}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < Math.floor(effectiveRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({effectiveReviewCount})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{product.price.toFixed(2)} €</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice.toFixed(2)} €
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="ml-4"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Ajouter' : 'Rupture'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
      <CardContent className="p-0">
        <div className="relative group/image">
          <ImageWithFallback
            src={getProductImageUrl(product)}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg cursor-pointer transition-transform group-hover:scale-105"
            onClick={() => onViewDetails(product.id)}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isOnSale && (
              <Badge variant="destructive" className="text-xs">
                -{discount}%
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge className="text-xs bg-green-500">
                Nouveau
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="secondary" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Top
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleWishlist}
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            >
              <Heart 
                className={cn(
                  "h-4 w-4",
                  inWishlist && "fill-current text-red-500"
                )} 
              />
            </Button>
            {onQuickView && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleQuickView}
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <Badge variant="secondary">Rupture de stock</Badge>
            </div>
          )}

          {/* Free shipping indicator */}
          {product.shippingInfo?.freeShipping && (
            <div className="absolute bottom-2 left-2">
              <Badge className="text-xs bg-blue-500">
                Livraison gratuite
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            {product.brand && (
              <span className="text-xs text-muted-foreground">
                {product.brand}
              </span>
            )}
          </div>
          
          <h3 
            className="line-clamp-2 mb-2 cursor-pointer hover:text-primary transition-colors"
            onClick={() => onViewDetails(product.id)}
          >
            {product.name}
          </h3>
          <button className="mb-3 block text-sm text-primary hover:underline" onClick={() => onViewVendor?.(product.vendorId)}>
            Vendu par {product.vendorName}
          </button>
          
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(effectiveRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({effectiveReviewCount})
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{product.price.toFixed(2)} €</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            {product.stockQuantity && product.stockQuantity <= 5 && product.inStock && (
              <span className="text-xs text-orange-500">
                Plus que {product.stockQuantity}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}