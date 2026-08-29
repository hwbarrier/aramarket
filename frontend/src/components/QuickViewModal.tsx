import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingCart, Truck, Shield, ArrowLeft, ArrowRight, ZoomIn, Share2 } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { cn } from './ui/utils';
import { Product } from './ProductCard';
import { useWishlist } from '../contexts/WishlistContext';
import { useNotifications } from '../contexts/NotificationContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onViewFullDetails: (productId: string) => void;
  relatedProducts?: Product[];
}

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') setIsZoomed(false);
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  return (
    <div className="relative group">
      {/* Image principale */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Navigation des images */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom indicator */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4" />
        </div>

        {/* Indicateur d'images */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all",
                index === currentImageIndex 
                  ? "border-primary" 
                  : "border-transparent hover:border-gray-300"
              )}
            >
              <img
                src={image}
                alt={`${productName} - Miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal de zoom */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative bg-black" onKeyDown={handleKeyPress} tabIndex={0}>
            <img
              src={images[currentImageIndex]}
              alt={`${productName} - Image agrandie`}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70"
              onClick={() => setIsZoomed(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onViewFullDetails,
  relatedProducts = []
}: QuickViewModalProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useNotifications();
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedVariant('');
    }
  }, [product]);

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];
  const inWishlist = isInWishlist(product.id);
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const savingsPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    
    showToast({
      title: '🛒 Ajouté au panier',
      description: `${quantity}x ${product.name} ajouté${quantity > 1 ? 's' : ''} au panier`,
      type: 'success'
    });
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description || `Découvrez ${product.name} sur AraMarket`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast({
          title: 'Lien copié',
          description: 'Le lien du produit a été copié dans le presse-papiers',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
          {/* Section image */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900">
            <ImageGallery images={images} productName={product.name} />
          </div>

          {/* Section détails */}
          <div className="p-6 overflow-y-auto max-h-[90vh]">
            <div className="space-y-4">
              {/* Header avec fermeture */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    {product.isOnSale && (
                      <Badge variant="destructive" className="text-xs">
                        -{savingsPercentage}%
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="secondary" className="text-xs">
                        Rupture de stock
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-medium mb-2">{product.name}</h2>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= product.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} avis)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Prix */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-medium">{product.price.toFixed(2)} €</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {product.originalPrice.toFixed(2)} €
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Vous économisez {savings.toFixed(2)} € ({savingsPercentage}%)
                  </p>
                )}
              </div>

              <Separator />

              {/* Description rapide */}
              {product.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Caractéristiques clés */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Caractéristiques</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />

              {/* Informations de livraison */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {product.shippingInfo?.freeShipping 
                      ? 'Livraison gratuite' 
                      : `Livraison ${product.shippingInfo?.cost || 5.99}€`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Garantie 2 ans</span>
                </div>
              </div>

              <Separator />

              {/* Quantité et actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Quantité:</label>
                    <div className="flex items-center border rounded">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      <span className="px-3 py-1 text-sm min-w-[40px] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={!product.inStock}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Total: {(product.price * quantity).toFixed(2)} €
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleWishlist}
                    className="px-4"
                  >
                    <Heart 
                      className={cn(
                        "h-4 w-4",
                        inWishlist && "fill-current text-red-500"
                      )} 
                    />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    onViewFullDetails(product.id);
                    onClose();
                  }}
                  className="w-full"
                >
                  Voir tous les détails
                </Button>
              </div>

              {/* Produits similaires */}
              {relatedProducts.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Produits similaires</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {relatedProducts.slice(0, 4).map((relatedProduct) => (
                      <Card 
                        key={relatedProduct.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          onViewFullDetails(relatedProduct.id);
                          onClose();
                        }}
                      >
                        <CardContent className="p-3">
                          <img
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            className="w-full h-20 object-cover rounded mb-2"
                          />
                          <h5 className="text-xs font-medium mb-1 line-clamp-2">
                            {relatedProduct.name}
                          </h5>
                          <p className="text-sm font-medium">
                            {relatedProduct.price.toFixed(2)} €
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}