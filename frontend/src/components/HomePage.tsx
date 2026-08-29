import { ProductCard, Product } from "./ProductCard";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { useLocalization } from "../contexts/LocalizationContext";

interface HomePageProps {
  featuredProducts: Product[];
  onViewDetails: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onPageChange: (page: string) => void;
}

export function HomePage({ featuredProducts, onViewDetails, onAddToCart, onPageChange }: HomePageProps) {
  const { t } = useLocalization();
  
  const categories = [
    { name: t('category.electronics'), icon: "📱", count: 24 },
    { name: t('category.fashion'), icon: "👕", count: 18 },
    { name: t('category.homeGarden'), icon: "🏠", count: 15 },
    { name: t('category.sports'), icon: "⚽", count: 12 }
  ];

  const features = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: t('home.freeShipping'),
      description: t('home.freeShippingDesc')
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: t('home.securePayment'),
      description: t('home.securePaymentDesc')
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: t('home.fastDelivery'),
      description: t('home.fastDeliveryDesc')
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold">{t('home.popularCategories')}</h3>
          <Button variant="ghost" onClick={() => onPageChange('categories')} className="text-sm">
            {t('home.viewAll')}
            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
                <h4 className="text-sm sm:text-base font-medium mb-1">{category.name}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{category.count} {t('category.items')}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold">{t('home.featuredProducts')}</h3>
          <Button variant="ghost" onClick={() => onPageChange('products')} className="text-sm">
            {t('home.viewAll')}
            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 text-primary mb-3 sm:mb-4">
                {feature.icon}
              </div>
              <h4 className="text-sm sm:text-base font-medium mb-2">{feature.title}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}