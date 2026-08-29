import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Gift, Percent, Truck, X, Copy, Clock, Users } from 'lucide-react';
import { useCoupons } from '../contexts/CouponContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { cn } from './ui/utils';
import { Coupon } from '../types/order';

interface CouponSectionProps {
  orderTotal: number;
  onCouponApplied?: (coupon: Coupon) => void;
  className?: string;
}

interface CouponCardProps {
  coupon: Coupon;
  onApply: (code: string) => void;
  isApplied?: boolean;
  orderTotal: number;
}

function CouponCard({ coupon, onApply, isApplied, orderTotal }: CouponCardProps) {
  const { calculateDiscount } = useCoupons();
  const [copied, setCopied] = useState(false);

  const discount = calculateDiscount(coupon, orderTotal);
  const isEligible = !coupon.minimumAmount || orderTotal >= coupon.minimumAmount;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const getIcon = () => {
    switch (coupon.type) {
      case 'percentage':
        return <Percent className="h-5 w-5" />;
      case 'fixed':
        return <Tag className="h-5 w-5" />;
      case 'free_shipping':
        return <Truck className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getDiscountText = () => {
    switch (coupon.type) {
      case 'percentage':
        return `${coupon.value}% de réduction`;
      case 'fixed':
        return `${coupon.value}€ de réduction`;
      case 'free_shipping':
        return 'Livraison gratuite';
      default:
        return 'Réduction';
    }
  };

  const daysUntilExpiry = Math.ceil((coupon.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all hover:shadow-md",
        isApplied && "ring-2 ring-primary",
        !isEligible && "opacity-60"
      )}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        
        <CardContent className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {getIcon()}
              </div>
              <div>
                <h4 className="font-medium text-sm">{coupon.name}</h4>
                <p className="text-xs text-muted-foreground">{getDiscountText()}</p>
              </div>
            </div>

            {isExpiringSoon && (
              <Badge variant="destructive" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {daysUntilExpiry}j
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {coupon.description}
          </p>

          {/* Code */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-muted/50 rounded border-2 border-dashed border-muted-foreground/20 p-2">
              <code className="text-sm font-mono font-medium">{coupon.code}</code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              <Copy className={cn("h-4 w-4", copied && "text-green-600")} />
            </Button>
          </div>

          {/* Conditions */}
          <div className="space-y-1 mb-3">
            {coupon.minimumAmount && (
              <p className="text-xs text-muted-foreground">
                • Minimum {coupon.minimumAmount}€
              </p>
            )}
            {coupon.maximumDiscount && coupon.type === 'percentage' && (
              <p className="text-xs text-muted-foreground">
                • Réduction max {coupon.maximumDiscount}€
              </p>
            )}
            {coupon.applicableCategories && (
              <p className="text-xs text-muted-foreground">
                • Valable sur : {coupon.applicableCategories.join(', ')}
              </p>
            )}
            {coupon.isFirstTimeUser && (
              <p className="text-xs text-muted-foreground">
                • Nouveaux clients uniquement
              </p>
            )}
          </div>

          {/* Usage */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {coupon.usedCount}/{coupon.usageLimit}
            </span>
            <span>
              Expire le {coupon.validUntil.toLocaleDateString('fr-FR')}
            </span>
          </div>

          {/* Preview */}
          {isEligible && discount > 0 && (
            <div className="bg-green-50 dark:bg-green-950 p-2 rounded mb-3">
              <p className="text-xs text-green-700 dark:text-green-300">
                💰 Vous économisez {discount.toFixed(2)}€
              </p>
            </div>
          )}

          {/* Action */}
          <Button
            size="sm"
            className="w-full"
            onClick={() => onApply(coupon.code)}
            disabled={!isEligible || isApplied}
            variant={isApplied ? "outline" : "default"}
          >
            {isApplied ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Retirer
              </>
            ) : (
              'Appliquer'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CouponSection({ orderTotal, onCouponApplied, className }: CouponSectionProps) {
  const { availableCoupons, appliedCoupon, applyCoupon, removeCoupon, generatePersonalizedCoupons } = useCoupons();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  // Coupons personnalisés (simulés)
  const personalizedCoupons = generatePersonalizedCoupons('user_id');
  const allCoupons = [...personalizedCoupons, ...availableCoupons];

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplying(true);
    const success = await applyCoupon(couponCode.trim(), orderTotal);
    
    if (success) {
      setCouponCode('');
      const coupon = allCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
      if (coupon && onCouponApplied) {
        onCouponApplied(coupon);
      }
    }
    
    setIsApplying(false);
  };

  const handleCouponCardApply = async (code: string) => {
    if (appliedCoupon?.code === code) {
      removeCoupon();
      return;
    }

    setIsApplying(true);
    const success = await applyCoupon(code, orderTotal);
    
    if (success && onCouponApplied) {
      const coupon = allCoupons.find(c => c.code === code);
      if (coupon) {
        onCouponApplied(coupon);
      }
    }
    
    setIsApplying(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  // Coupons suggérés (3 premiers coupons éligibles)
  const suggestedCoupons = allCoupons
    .filter(coupon => !coupon.minimumAmount || orderTotal >= coupon.minimumAmount)
    .slice(0, 3);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Section d'application manuelle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Tag className="h-5 w-5" />
            Code promo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Entrez votre code promo"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || isApplying}
            >
              {isApplying ? 'Application...' : 'Appliquer'}
            </Button>
          </div>

          {/* Coupon appliqué */}
          <AnimatePresence>
            {appliedCoupon && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-green-100 dark:bg-green-900 rounded">
                      {appliedCoupon.type === 'percentage' ? (
                        <Percent className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : appliedCoupon.type === 'fixed' ? (
                        <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        {appliedCoupon.name}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Code: {appliedCoupon.code}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeCoupon}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Coupons suggérés */}
      {suggestedCoupons.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-5 w-5" />
              Offres disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {suggestedCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onApply={handleCouponCardApply}
                  isApplied={appliedCoupon?.code === coupon.code}
                  orderTotal={orderTotal}
                />
              ))}
            </div>

            {allCoupons.length > 3 && (
              <div className="text-center">
                <Dialog open={showAllCoupons} onOpenChange={setShowAllCoupons}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Voir tous les coupons ({allCoupons.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                    <DialogHeader>
                      <DialogTitle>Tous les coupons disponibles</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh] pr-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allCoupons.map((coupon) => (
                          <CouponCard
                            key={coupon.id}
                            coupon={coupon}
                            onApply={(code) => {
                              handleCouponCardApply(code);
                              setShowAllCoupons(false);
                            }}
                            isApplied={appliedCoupon?.code === coupon.code}
                            orderTotal={orderTotal}
                          />
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conseils */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Maximisez vos économies !
              </h4>
              <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                <li>• Inscrivez-vous à notre newsletter pour des codes exclusifs</li>
                <li>• Les coupons sont cumulables selon les conditions</li>
                <li>• Vérifiez régulièrement les nouvelles offres</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}