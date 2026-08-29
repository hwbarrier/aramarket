import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coupon } from '../types/order';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface CouponContextType {
  availableCoupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string, orderTotal: number) => Promise<boolean>;
  removeCoupon: () => void;
  validateCoupon: (code: string, orderTotal: number) => Promise<{ valid: boolean; error?: string }>;
  getUserCoupons: () => Coupon[];
  calculateDiscount: (coupon: Coupon, orderTotal: number) => number;
  generatePersonalizedCoupons: (userId: string) => Coupon[];
  isFirstTimeUser: () => boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function useCoupons() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
}

interface CouponProviderProps {
  children: React.ReactNode;
}

// Mock coupons data
const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    name: 'Bienvenue',
    description: '10% de réduction pour les nouveaux clients',
    type: 'percentage',
    value: 10,
    minimumAmount: 50,
    maximumDiscount: 50,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    usageLimit: 1000,
    usedCount: 245,
    isActive: true,
    isFirstTimeUser: true
  },
  {
    id: '2',
    code: 'SAVE20',
    name: 'Économie',
    description: '20€ de réduction sur les commandes de plus de 100€',
    type: 'fixed',
    value: 20,
    minimumAmount: 100,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-06-30'),
    usageLimit: 500,
    usedCount: 123,
    isActive: true
  },
  {
    id: '3',
    code: 'FREESHIP',
    name: 'Livraison gratuite',
    description: 'Livraison gratuite sans minimum',
    type: 'free_shipping',
    value: 0,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    usageLimit: 10000,
    usedCount: 2456,
    isActive: true
  },
  {
    id: '4',
    code: 'ELECTRONICS15',
    name: 'Electronics Promo',
    description: '15% sur tous les produits électroniques',
    type: 'percentage',
    value: 15,
    minimumAmount: 75,
    maximumDiscount: 100,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-03-31'),
    usageLimit: 200,
    usedCount: 89,
    applicableCategories: ['Electronics'],
    isActive: true
  },
  {
    id: '5',
    code: 'FASHION25',
    name: 'Fashion Week',
    description: '25% sur la mode et les accessoires',
    type: 'percentage',
    value: 25,
    minimumAmount: 60,
    maximumDiscount: 75,
    validFrom: new Date('2024-02-01'),
    validUntil: new Date('2024-02-29'),
    usageLimit: 300,
    usedCount: 167,
    applicableCategories: ['Fashion'],
    isActive: true
  }
];

export function CouponProvider({ children }: CouponProviderProps) {
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>(import.meta.env.DEV ? mockCoupons : []);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [usedCoupons, setUsedCoupons] = useState<string[]>([]);
  const { authState } = useAuth();
  const { showToast } = useNotifications();

  // Charger l'historique des coupons utilisés
  useEffect(() => {
    const savedUsedCoupons = localStorage.getItem('used_coupons');
    if (savedUsedCoupons) {
      try {
        setUsedCoupons(JSON.parse(savedUsedCoupons));
      } catch (error) {
        console.error('Erreur lors du chargement des coupons utilisés:', error);
      }
    }
  }, []);

  const validateCoupon = async (code: string, orderTotal: number): Promise<{ valid: boolean; error?: string }> => {
    const coupon = availableCoupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!coupon) {
      return { valid: false, error: 'Code de coupon invalide' };
    }

    if (!coupon.isActive) {
      return { valid: false, error: 'Ce coupon n\'est plus actif' };
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return { valid: false, error: 'Ce coupon a expiré ou n\'est pas encore valide' };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: 'Ce coupon a atteint sa limite d\'utilisation' };
    }

    if (coupon.minimumAmount && orderTotal < coupon.minimumAmount) {
      return { valid: false, error: `Commande minimum de ${coupon.minimumAmount}€ requise` };
    }

    if (coupon.isFirstTimeUser && !isFirstTimeUser()) {
      return { valid: false, error: 'Ce coupon est réservé aux nouveaux clients' };
    }

    // Vérifier si l'utilisateur a déjà utilisé ce coupon (pour les coupons à usage unique)
    if (authState.isAuthenticated && usedCoupons.includes(coupon.code)) {
      return { valid: false, error: 'Vous avez déjà utilisé ce coupon' };
    }

    return { valid: true };
  };

  const applyCoupon = async (code: string, orderTotal: number): Promise<boolean> => {
    const validation = await validateCoupon(code, orderTotal);
    
    if (!validation.valid) {
      showToast({
        title: 'Coupon invalide',
        description: validation.error || 'Ce coupon ne peut pas être appliqué',
        type: 'error'
      });
      return false;
    }

    const coupon = availableCoupons.find(c => c.code.toLowerCase() === code.toLowerCase())!;
    setAppliedCoupon(coupon);

    const discount = calculateDiscount(coupon, orderTotal);
    
    showToast({
      title: '🎉 Coupon appliqué',
      description: coupon.type === 'free_shipping' 
        ? 'Livraison gratuite appliquée !'
        : `Réduction de ${discount.toFixed(2)}€ appliquée`,
      type: 'success'
    });

    return true;
  };

  const removeCoupon = () => {
    if (appliedCoupon) {
      showToast({
        title: 'Coupon retiré',
        description: 'Le coupon a été retiré de votre commande',
        type: 'info'
      });
      setAppliedCoupon(null);
    }
  };

  const calculateDiscount = (coupon: Coupon, orderTotal: number): number => {
    switch (coupon.type) {
      case 'percentage':
        const percentageDiscount = (orderTotal * coupon.value) / 100;
        return coupon.maximumDiscount 
          ? Math.min(percentageDiscount, coupon.maximumDiscount)
          : percentageDiscount;
      
      case 'fixed':
        return Math.min(coupon.value, orderTotal);
      
      case 'free_shipping':
        return 0; // La livraison gratuite sera gérée séparément
      
      default:
        return 0;
    }
  };

  const getUserCoupons = (): Coupon[] => {
    const now = new Date();
    
    return availableCoupons.filter(coupon => {
      // Filtrer les coupons actifs et valides
      if (!coupon.isActive || now > coupon.validUntil || coupon.usedCount >= coupon.usageLimit) {
        return false;
      }

      // Exclure les coupons déjà utilisés par l'utilisateur
      if (authState.isAuthenticated && usedCoupons.includes(coupon.code)) {
        return false;
      }

      // Filtrer les coupons réservés aux nouveaux utilisateurs
      if (coupon.isFirstTimeUser && !isFirstTimeUser()) {
        return false;
      }

      return true;
    });
  };

  const isFirstTimeUser = (): boolean => {
    // En production, cela vérifierait l'historique des commandes
    return authState.isAuthenticated && authState.user?.orders?.length === 0;
  };

  const generatePersonalizedCoupons = (userId: string): Coupon[] => {
    const personalizedCoupons: Coupon[] = [];
    
    // Coupon d'anniversaire (simulé)
    const now = new Date();
    personalizedCoupons.push({
      id: `birthday_${userId}`,
      code: `BIRTHDAY${now.getFullYear()}`,
      name: 'Anniversaire',
      description: 'Joyeux anniversaire ! 20% de réduction spéciale',
      type: 'percentage',
      value: 20,
      minimumAmount: 30,
      maximumDiscount: 50,
      validFrom: now,
      validUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      usageLimit: 1,
      usedCount: 0,
      isActive: true
    });

    // Coupon de retour client
    if (authState.user?.lastOrderDate) {
      const daysSinceLastOrder = Math.floor((now.getTime() - authState.user.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastOrder > 30) {
        personalizedCoupons.push({
          id: `comeback_${userId}`,
          code: 'COMEBACK15',
          name: 'De retour parmi nous',
          description: 'Content de vous revoir ! 15% de réduction',
          type: 'percentage',
          value: 15,
          minimumAmount: 40,
          maximumDiscount: 40,
          validFrom: now,
          validUntil: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 jours
          usageLimit: 1,
          usedCount: 0,
          isActive: true
        });
      }
    }

    return personalizedCoupons;
  };

  // Marquer un coupon comme utilisé lors du checkout
  const markCouponAsUsed = (couponCode: string) => {
    const newUsedCoupons = [...usedCoupons, couponCode];
    setUsedCoupons(newUsedCoupons);
    localStorage.setItem('used_coupons', JSON.stringify(newUsedCoupons));
    
    // Incrémenter le compteur d'utilisation
    setAvailableCoupons(prev => prev.map(coupon => 
      coupon.code === couponCode 
        ? { ...coupon, usedCount: coupon.usedCount + 1 }
        : coupon
    ));
  };

  const value: CouponContextType = {
    availableCoupons: getUserCoupons(),
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    validateCoupon,
    getUserCoupons,
    calculateDiscount,
    generatePersonalizedCoupons,
    isFirstTimeUser
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
}