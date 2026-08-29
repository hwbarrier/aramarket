import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem } from '../types/product';
import { Product } from '../components/ProductCard';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  shareWishlist: () => Promise<string>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

interface WishlistProviderProps {
  children: React.ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { authState } = useAuth();
  const { showToast } = useNotifications();

  // Clé de stockage basée sur l'utilisateur
  const getStorageKey = () => {
    return authState.isAuthenticated 
      ? `wishlist_${authState.user?.id || 'guest'}` 
      : 'wishlist_guest';
  };

  // Charger la wishlist depuis le localStorage
  useEffect(() => {
    const storageKey = getStorageKey();
    const savedWishlist = localStorage.getItem(storageKey);
    
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlistItems(parsedWishlist);
      } catch (error) {
        console.error('Erreur lors du chargement de la wishlist:', error);
        setWishlistItems([]);
      }
    }
  }, [authState.isAuthenticated, authState.user?.id]);

  // Sauvegarder la wishlist dans le localStorage
  useEffect(() => {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, authState.isAuthenticated, authState.user?.id]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const addToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      showToast({
        title: 'Déjà dans vos favoris',
        description: 'Ce produit est déjà dans votre liste de souhaits',
        type: 'warning'
      });
      return;
    }

    const wishlistItem: WishlistItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      userId: authState.user?.id || 'guest',
      dateAdded: new Date(),
      product: product
    };

    setWishlistItems(prev => [...prev, wishlistItem]);

    showToast({
      title: '❤️ Ajouté aux favoris',
      description: `${product.name} a été ajouté à votre liste de souhaits`,
      type: 'success',
      action: {
        label: 'Voir la liste',
        onClick: () => {
          return undefined;
        }
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    const item = wishlistItems.find(item => item.productId === productId);
    
    if (!item) return;

    setWishlistItems(prev => prev.filter(item => item.productId !== productId));

    showToast({
      title: '💔 Retiré des favoris',
      description: `${item.product?.name || 'Le produit'} a été retiré de votre liste de souhaits`,
      type: 'info'
    });
  };

  const clearWishlist = () => {
    const count = wishlistItems.length;
    setWishlistItems([]);

    showToast({
      title: '🗑️ Liste vidée',
      description: `${count} produit(s) retiré(s) de votre liste de souhaits`,
      type: 'info'
    });
  };

  const shareWishlist = async (): Promise<string> => {
    const wishlistData = {
      items: wishlistItems.map(item => ({
        productId: item.productId,
        productName: item.product?.name,
        productImage: item.product?.image,
        price: item.product?.price
      })),
      shareDate: new Date().toISOString(),
      userName: authState.user?.name || 'Utilisateur anonyme'
    };

    // En production, cela ferait appel à une API pour créer un lien partageable
    const shareableData = btoa(JSON.stringify(wishlistData));
    const shareUrl = `${window.location.origin}/wishlist/shared/${shareableData}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Ma liste de souhaits AraMarket',
          text: 'Découvrez ma sélection de produits favoris !',
          url: shareUrl
        });
      } else {
        // Fallback: copier dans le presse-papiers
        await navigator.clipboard.writeText(shareUrl);
        showToast({
          title: '📋 Lien copié',
          description: 'Le lien de partage a été copié dans le presse-papiers',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      showToast({
        title: 'Erreur de partage',
        description: 'Impossible de partager la liste pour le moment',
        type: 'error'
      });
    }

    return shareUrl;
  };

  const wishlistCount = wishlistItems.length;

  const value: WishlistContextType = {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    wishlistCount,
    shareWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}