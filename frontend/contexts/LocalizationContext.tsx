import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr';
export type Currency = 'USD' | 'XOF' | 'EUR';

interface LocalizationContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  formatPrice: (price: number) => string;
  t: (key: string, defaultValue?: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Taux de change fictifs (dans une vraie app, cela viendrait d'une API)
const exchangeRates: Record<Currency, number> = {
  USD: 1,      // Dollar américain (base)
  XOF: 600,    // CFA Franc BCEAO
  EUR: 0.85    // Euro
};

// Symboles de devises
const currencySymbols: Record<Currency, string> = {
  USD: '$',
  XOF: 'CFA',
  EUR: '€'
};

// Traductions
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.search': 'Search...',
    
    // Homepage
    'home.newCollection': 'New Collection',
    'home.discoverAramarket': 'Discover AraMarket',
    'home.marketplaceDescription': 'Your oriental marketplace for authentic and quality products. Explore our unique selection.',
    'home.explore': 'Explore',
    'home.fashionStyle': 'Fashion & Style',
    'home.fashionCollection': 'Fashion Collection',
    'home.fashionDescription': 'Trendy and timeless clothing. Express your style with our exclusive fashion selection.',
    'home.viewFashion': 'View Fashion',
    'home.highTech': 'High-Tech',
    'home.electronicsTitle': 'Premium Electronics',
    'home.electronicsDescription': 'Latest technological innovations at competitive prices. Stay connected with our electronics range.',
    'home.homeDecor': 'Home & Decor',
    'home.decorationTitle': 'Interior Decoration',
    'home.decorationDescription': 'Transform your space with our decor collection. Unique pieces for an interior that reflects you.',
    'home.decorate': 'Decorate',
    'home.popularCategories': 'Popular Categories',
    'home.featuredProducts': 'Featured Products',
    'home.viewAll': 'View All',
    'home.freeShipping': 'Free Shipping',
    'home.freeShippingDesc': 'On orders over $50',
    'home.securePayment': 'Secure Payment',
    'home.securePaymentDesc': 'Your data is protected',
    'home.fastDelivery': 'Fast Delivery',
    'home.fastDeliveryDesc': '2-3 business days',
    
    // Products
    'products.addToCart': 'Add to Cart',
    'products.viewDetails': 'View Details',
    'products.outOfStock': 'Out of Stock',
    'products.inStock': 'In Stock',
    'products.sale': 'Sale',
    'products.reviews': 'reviews',
    
    // Cart
    'cart.title': 'My Cart',
    'cart.empty': 'Your cart is empty',
    'cart.startShopping': 'Start Shopping',
    'cart.quantity': 'Quantity',
    'cart.price': 'Price',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.proceedToCheckout': 'Proceed to Checkout',
    'cart.remove': 'Remove',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.creditCard': 'Credit Card',
    'checkout.paypal': 'PayPal',
    'checkout.cashOnDelivery': 'Cash on Delivery',
    'checkout.placeOrder': 'Place Order',
    'checkout.orderSummary': 'Order Summary',
    
    // Categories
    'category.electronics': 'Electronics',
    'category.fashion': 'Fashion',
    'category.homeGarden': 'Home & Garden',
    'category.sports': 'Sports',
    'category.items': 'items',
    
    // Categories Page
    'categories.title': 'All Categories',
    'categories.description': 'Discover our wide range of products organized by categories. Easily find what you are looking for among our different sections.',
    'categories.searchPlaceholder': 'Search a category...',
    'categories.stats.total': 'Categories',
    'categories.stats.subCategories': 'Subcategories',
    'categories.stats.filtered': 'Found',
    'categories.noResults': 'No category found',
    'categories.noResultsDesc': 'Try with another search term',
    'categories.subCategoriesCount': 'subcategories',
    'categories.viewAll': 'View all products',
    'categories.subCategories': 'Subcategories',
    'categories.more': 'more',
    'categories.recommended.title': 'Recommended Categories',
    'categories.recommended.description': 'Discover our most appreciated categories by our users',
    'categories.help.title': 'Can\'t find what you\'re looking for?',
    'categories.help.description': 'Explore all our products or return to home to discover our personalized recommendations.',
    'categories.help.browseAll': 'Browse all products',
    'categories.help.backHome': 'Back to home',
    'categories.footer.info': 'Last category update: Today',
    
    // Breadcrumb
    'breadcrumb.home': 'Home',
    'breadcrumb.categories': 'Categories',
    
    // Messaging
    'messaging.title': 'Messaging',
    'messaging.description': 'Communicate with vendors and manage your conversations',
    'messaging.newConversation': 'New conversation',
    'messaging.searchPlaceholder': 'Search a conversation...',
    'messaging.filterBy': 'Filter by',
    'messaging.all': 'All',
    'messaging.unread': 'Unread',
    'messaging.active': 'Active',
    'messaging.archived': 'Archived',
    'messaging.selectConversation': 'Select a conversation',
    'messaging.selectConversationDesc': 'Choose a conversation from the list to start chatting',
    'messaging.typePlaceholder': 'Type your message...',
    'messaging.templates': 'Templates',
    'messaging.useTemplate': 'Use a template',
    'messaging.send': 'Send',
    'messaging.archive': 'Archive',
    'messaging.markResolved': 'Mark as resolved',
    'messaging.flag': 'Flag',
    'messaging.priority': 'Priority',
    'messaging.urgent': 'Urgent',
    'messaging.high': 'High',
    'messaging.normal': 'Normal',
    'messaging.low': 'Low',
    'messaging.online': 'Online',
    'messaging.offline': 'Offline',
    'messaging.stats.conversations': 'Conversations',
    'messaging.stats.active': 'Active',
    'messaging.stats.unread': 'Unread',
    'messaging.stats.responseRate': 'Response rate',
    
    // Common
    'common.language': 'Language',
    'common.currency': 'Currency',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel'
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.categories': 'Catégories',
    'nav.cart': 'Panier',
    'nav.profile': 'Profil',
    'nav.login': 'Connexion',
    'nav.search': 'Rechercher...',
    
    // Homepage
    'home.newCollection': 'Nouvelle Collection',
    'home.discoverAramarket': 'Découvrez AraMarket',
    'home.marketplaceDescription': 'Votre marketplace orientale pour des produits authentiques et de qualité. Explorez notre sélection unique.',
    'home.explore': 'Explorer',
    'home.fashionStyle': 'Mode & Style',
    'home.fashionCollection': 'Collection Fashion',
    'home.fashionDescription': 'Des vêtements tendance et intemporels. Exprimez votre style avec notre sélection mode exclusive.',
    'home.viewFashion': 'Voir la Mode',
    'home.highTech': 'High-Tech',
    'home.electronicsTitle': 'Électronique Premium',
    'home.electronicsDescription': 'Les dernières innovations technologiques à prix compétitifs. Restez connecté avec notre gamme électronique.',
    'home.homeDecor': 'Maison & Déco',
    'home.decorationTitle': 'Décoration Intérieure',
    'home.decorationDescription': 'Transformez votre espace avec notre collection déco. Des pièces uniques pour un intérieur qui vous ressemble.',
    'home.decorate': 'Décorer',
    'home.popularCategories': 'Catégories Populaires',
    'home.featuredProducts': 'Produits Populaires',
    'home.viewAll': 'Voir Tout',
    'home.freeShipping': 'Livraison Gratuite',
    'home.freeShippingDesc': 'Sur commandes +50€',
    'home.securePayment': 'Paiement Sécurisé',
    'home.securePaymentDesc': 'Vos données protégées',
    'home.fastDelivery': 'Livraison Rapide',
    'home.fastDeliveryDesc': '2-3 jours ouvrés',
    
    // Products
    'products.addToCart': 'Ajouter au Panier',
    'products.viewDetails': 'Voir Détails',
    'products.outOfStock': 'Rupture de Stock',
    'products.inStock': 'En Stock',
    'products.sale': 'Promo',
    'products.reviews': 'avis',
    
    // Cart
    'cart.title': 'Mon Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.startShopping': 'Commencer mes achats',
    'cart.quantity': 'Quantité',
    'cart.price': 'Prix',
    'cart.total': 'Total',
    'cart.subtotal': 'Sous-total',
    'cart.shipping': 'Livraison',
    'cart.free': 'Gratuit',
    'cart.proceedToCheckout': 'Finaliser la commande',
    'cart.remove': 'Supprimer',
    
    // Checkout
    'checkout.title': 'Finaliser la commande',
    'checkout.paymentMethod': 'Mode de paiement',
    'checkout.creditCard': 'Carte de crédit',
    'checkout.paypal': 'PayPal',
    'checkout.cashOnDelivery': 'Paiement à la livraison',
    'checkout.placeOrder': 'Commander',
    'checkout.orderSummary': 'Résumé de commande',
    
    // Categories
    'category.electronics': 'Électronique',
    'category.fashion': 'Mode',
    'category.homeGarden': 'Maison & Jardin',
    'category.sports': 'Sports',
    'category.items': 'articles',
    
    // Categories Page
    'categories.title': 'Toutes les Catégories',
    'categories.description': 'Découvrez notre large gamme de produits organisés par catégories. Trouvez facilement ce que vous cherchez parmi nos différentes sections.',
    'categories.searchPlaceholder': 'Rechercher une catégorie...',
    'categories.stats.total': 'Catégories',
    'categories.stats.subCategories': 'Sous-catégories',
    'categories.stats.filtered': 'Trouvées',
    'categories.noResults': 'Aucune catégorie trouvée',
    'categories.noResultsDesc': 'Essayez avec un autre terme de recherche',
    'categories.subCategoriesCount': 'sous-catégories',
    'categories.viewAll': 'Voir tous les produits',
    'categories.subCategories': 'Sous-catégories',
    'categories.more': 'de plus',
    'categories.recommended.title': 'Catégories Recommandées',
    'categories.recommended.description': 'Découvrez nos catégories les plus appréciées par nos utilisateurs',
    'categories.help.title': 'Vous ne trouvez pas ce que vous cherchez ?',
    'categories.help.description': 'Explorez tous nos produits ou retournez à l\'accueil pour découvrir nos recommandations personnalisées.',
    'categories.help.browseAll': 'Parcourir tous les produits',
    'categories.help.backHome': 'Retour à l\'accueil',
    'categories.footer.info': 'Dernière mise à jour des catégories : Aujourd\'hui',
    
    // Breadcrumb
    'breadcrumb.home': 'Accueil',
    'breadcrumb.categories': 'Catégories',
    
    // Messaging
    'messaging.title': 'Messagerie',
    'messaging.description': 'Communiquez avec les vendeurs et gérez vos conversations',
    'messaging.newConversation': 'Nouvelle conversation',
    'messaging.searchPlaceholder': 'Rechercher une conversation...',
    'messaging.filterBy': 'Filtrer par',
    'messaging.all': 'Toutes',
    'messaging.unread': 'Non lues',
    'messaging.active': 'Actives',
    'messaging.archived': 'Archivées',
    'messaging.selectConversation': 'Sélectionnez une conversation',
    'messaging.selectConversationDesc': 'Choisissez une conversation dans la liste pour commencer à échanger',
    'messaging.typePlaceholder': 'Tapez votre message...',
    'messaging.templates': 'Templates',
    'messaging.useTemplate': 'Utiliser un template',
    'messaging.send': 'Envoyer',
    'messaging.archive': 'Archiver',
    'messaging.markResolved': 'Marquer comme résolu',
    'messaging.flag': 'Signaler',
    'messaging.priority': 'Priorité',
    'messaging.urgent': 'Urgente',
    'messaging.high': 'Haute',
    'messaging.normal': 'Normale',
    'messaging.low': 'Basse',
    'messaging.online': 'En ligne',
    'messaging.offline': 'Hors ligne',
    'messaging.stats.conversations': 'Conversations',
    'messaging.stats.active': 'Actives',
    'messaging.stats.unread': 'Non lues',
    'messaging.stats.responseRate': 'Taux réponse',
    
    // Common
    'common.language': 'Langue',
    'common.currency': 'Devise',
    'common.close': 'Fermer',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler'
  }
};

interface LocalizationProviderProps {
  children: ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');

  const formatPrice = (price: number): string => {
    const convertedPrice = price * exchangeRates[currency];
    const symbol = currencySymbols[currency];
    
    // Format selon la devise
    if (currency === 'XOF') {
      return `${convertedPrice.toFixed(0)} ${symbol}`;
    }
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  const t = (key: string, defaultValue?: string): string => {
    return translations[language][key] || defaultValue || key;
  };

  return (
    <LocalizationContext.Provider value={{
      language,
      currency,
      setLanguage,
      setCurrency,
      formatPrice,
      t
    }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}