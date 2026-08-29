import { isValidElement, lazy, Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppRouter } from "./router";
import { Navigation } from "./components/Navigation";
const HomePage = lazy(() => import("./components/HomePage").then(module => ({ default: module.HomePage })));
const ProductsPage = lazy(() => import("./components/ProductsPage").then(module => ({ default: module.ProductsPage })));
const CategoriesPage = lazy(() => import("./components/CategoriesPage").then(module => ({ default: module.CategoriesPage })));
const CartPage = lazy(() => import("./components/CartPage").then(module => ({ default: module.CartPage })));
const CheckoutPage = lazy(() => import("./components/CheckoutPage").then(module => ({ default: module.CheckoutPage })));
const ProductDetailPage = lazy(() => import("./components/ProductDetailPage").then(module => ({ default: module.ProductDetailPage })));
const ProfilePage = lazy(() => import("./components/ProfilePage").then(module => ({ default: module.ProfilePage })));
const WishlistPage = lazy(() => import("./components/WishlistPage").then(module => ({ default: module.WishlistPage })));
const MessagingPage = lazy(() => import("./components/MessagingPage").then(module => ({ default: module.MessagingPage })));
const MessageTemplatesPage = lazy(() => import("./components/MessageTemplatesPage").then(module => ({ default: module.MessageTemplatesPage })));
const ConversationHistory = lazy(() => import("./components/ConversationHistory").then(module => ({ default: module.ConversationHistory })));
import { MessageNotifications } from "./components/MessageNotifications";
const LoginPage = lazy(() => import("./components/auth/LoginPage").then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("./components/auth/RegisterPage").then(module => ({ default: module.RegisterPage })));
const BecomeVendorPage = lazy(() => import("./components/BecomeVendorPage").then(module => ({ default: module.BecomeVendorPage })));
import { AdminCenter } from "./features/admin/AdminCenter";
const VendorDashboard = lazy(() => import("./components/vendor/VendorDashboard").then(module => ({ default: module.VendorDashboard })));
import { Footer } from "./components/Footer";
import { HeroBanner } from "./components/HeroBanner";
import { ToastContainer } from "./components/ToastContainer";
import type { Product } from "./components/ProductCard";
const VendorsPage = lazy(() => import("./components/VendorsPage").then(module => ({ default: module.VendorsPage })));
const VendorStorePage = lazy(() => import("./components/VendorStorePage").then(module => ({ default: module.VendorStorePage })));
import { useCart } from "./contexts/CartContext";
const OrdersPage = lazy(() => import("./components/OrdersPage").then(module => ({ default: module.OrdersPage })));
const OrderDetailPage = lazy(() => import("./components/OrderDetailPage").then(module => ({ default: module.OrderDetailPage })));
import { useAuth } from "./contexts/AuthContext";
import { orderService } from "./services/order.service";
import { paymentService } from "./services/payment.service";
import { OrderCustomer, PaymentMethod } from "./types/order";
import { productService } from "./services/product.service";

// Mock product data with enhanced features
const mockProducts: Product[] = import.meta.env.DEV ? [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones Premium",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1740803292814-13d2e35924c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTc5NzE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1740803292814-13d2e35924c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTc5NzE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1080&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1080&h=1080&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 128,
    category: "Electronics",
    brand: "TechSound",
    description: "Casque audio sans fil haut de gamme avec réduction de bruit active et autonomie de 30 heures. Son cristallin et confort optimal pour un usage prolongé.",
    features: [
      "Réduction de bruit active",
      "Autonomie 30 heures",
      "Bluetooth 5.0",
      "Charge rapide USB-C",
      "Pliable et portable"
    ],
    specifications: {
      "Connectivité": "Bluetooth 5.0, Jack 3.5mm",
      "Autonomie": "30 heures",
      "Temps de charge": "2 heures",
      "Poids": "250g",
      "Garantie": "2 ans"
    },
    inStock: true,
    stockQuantity: 45,
    isOnSale: true,
    saleEndDate: new Date('2024-03-31'),
    tags: ["bestseller", "premium", "wireless"],
    vendorId: "vendor1",
    vendorName: "TechStore Pro",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: 2,
      cost: 0
    },
    dateAdded: new Date('2024-01-15'),
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: "2",
    name: "Premium Cotton T-Shirt Organic",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1555529669-2269763671c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTc5MzE2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1555529669-2269763671c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTc5MzE2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1080&h=1080&fit=crop"
    ],
    rating: 4.2,
    reviewCount: 89,
    category: "Fashion",
    brand: "EcoWear",
    description: "T-shirt en coton biologique certifié, doux et respectueux de l'environnement. Coupe moderne et confortable pour un style décontracté.",
    features: [
      "100% coton biologique",
      "Certification GOTS",
      "Coupe moderne",
      "Teintures écologiques",
      "Lavable en machine"
    ],
    specifications: {
      "Matière": "100% coton biologique",
      "Coupe": "Regular fit",
      "Entretien": "Lavage machine 30°C",
      "Origine": "Portugal",
      "Certification": "GOTS"
    },
    inStock: true,
    stockQuantity: 78,
    isOnSale: false,
    tags: ["eco-friendly", "organic", "sustainable"],
    vendorId: "vendor2",
    vendorName: "Green Fashion",
    shippingInfo: {
      freeShipping: false,
      estimatedDays: 3,
      cost: 4.99
    },
    dateAdded: new Date('2024-02-01'),
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false
  },
  {
    id: "3",
    name: "Modern Table Lamp Scandinavian Design",
    price: 89.50,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1634824506573-4a430d1d6111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3IlMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzU3OTE4OTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1634824506573-4a430d1d6111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3IlMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzU3OTE4OTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    rating: 4.8,
    reviewCount: 45,
    category: "Home & Garden",
    brand: "Nordic Light",
    description: "Lampe de table au design scandinave épuré. Base en bois massif et abat-jour en lin naturel pour une ambiance chaleureuse et moderne.",
    features: [
      "Design scandinave",
      "Base en chêne massif",
      "Abat-jour en lin naturel",
      "Éclairage LED inclus",
      "Variateur d'intensité"
    ],
    specifications: {
      "Matériaux": "Chêne massif, lin naturel",
      "Dimensions": "H: 45cm, D: 25cm",
      "Ampoule": "LED E27 incluse",
      "Puissance": "Max 15W",
      "Poids": "1.2kg"
    },
    inStock: true,
    stockQuantity: 23,
    isOnSale: true,
    saleEndDate: new Date('2024-04-15'),
    tags: ["design", "scandinave", "eco-friendly"],
    vendorId: "vendor3",
    vendorName: "Home Decor Pro",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: 4,
      cost: 0
    },
    dateAdded: new Date('2024-01-20'),
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: true
  },
  {
    id: "4",
    name: "Fitness Resistance Bands Set Pro",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaXRuZXNzJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1NzkyMTg4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaXRuZXNzJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1NzkyMTg4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    rating: 4.1,
    reviewCount: 67,
    category: "Sports",
    brand: "FitPro",
    description: "Set complet de bandes de résistance pour un entraînement complet à domicile. 5 niveaux de résistance inclus avec accessoires.",
    features: [
      "5 niveaux de résistance",
      "Poignées ergonomiques",
      "Ancrage de porte inclus",
      "Sac de transport",
      "Guide d'exercices"
    ],
    specifications: {
      "Résistances": "10-15-20-25-30 lbs",
      "Matériau": "Latex naturel",
      "Longueur": "120cm",
      "Accessoires": "Poignées, ancrage, sangles",
      "Garantie": "1 an"
    },
    inStock: false,
    stockQuantity: 0,
    isOnSale: false,
    tags: ["fitness", "home-workout", "resistance"],
    vendorId: "vendor4",
    vendorName: "SportMax",
    shippingInfo: {
      freeShipping: false,
      estimatedDays: 5,
      cost: 6.99
    },
    dateAdded: new Date('2024-01-10'),
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: false
  },
  {
    id: "5",
    name: "Smart Watch Series 5 Advanced",
    price: 299.99,
    originalPrice: 349.99,
    image: "https://images.unsplash.com/photo-1740803292814-13d2e35924c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTc5NzE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1740803292814-13d2e35924c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTc5NzE3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    rating: 4.7,
    reviewCount: 234,
    category: "Electronics",
    brand: "WatchTech",
    description: "Montre connectée avancée avec GPS, moniteur de santé complet et autonomie 7 jours. Compatible iOS et Android.",
    features: [
      "GPS intégré",
      "Moniteur cardiaque",
      "Résistant à l'eau IPX8",
      "Autonomie 7 jours",
      "+ de 100 sports"
    ],
    specifications: {
      "Écran": "AMOLED 1.4 pouces",
      "Résistance": "5ATM + IP68",
      "Capteurs": "GPS, cardio, SpO2",
      "Autonomie": "7 jours",
      "Compatibilité": "iOS 10+, Android 6+"
    },
    inStock: true,
    stockQuantity: 67,
    isOnSale: true,
    saleEndDate: new Date('2024-05-01'),
    tags: ["smartwatch", "gps", "health"],
    vendorId: "vendor1",
    vendorName: "TechStore Pro",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: 1,
      cost: 0
    },
    dateAdded: new Date('2024-02-10'),
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: "6",
    name: "Designer Sneakers Limited Edition",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1555529669-2269763671c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTc5MzE2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1555529669-2269763671c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTc5MzE2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    rating: 4.3,
    reviewCount: 156,
    category: "Fashion",
    brand: "UrbanStep",
    description: "Baskets design en édition limitée, alliant style urbain et confort. Matériaux premium et finitions soignées.",
    features: [
      "Édition limitée",
      "Matériaux premium",
      "Semelle amortissante",
      "Design exclusif",
      "Emballage collector"
    ],
    specifications: {
      "Matériaux": "Cuir véritable, mesh respirant",
      "Semelle": "Caoutchouc antidérapant",
      "Tailles": "36 à 46",
      "Couleurs": "Blanc, Noir, Beige",
      "Entretien": "Nettoyage à sec"
    },
    inStock: true,
    stockQuantity: 34,
    isOnSale: false,
    tags: ["limited-edition", "designer", "premium"],
    vendorId: "vendor2",
    vendorName: "Green Fashion",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: 3,
      cost: 0
    },
    dateAdded: new Date('2024-02-15'),
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false
  }
] : [];

export function AppRoutes() {
  const [products, setProducts] = useState<Product[]>(import.meta.env.MODE === "test" ? [] : mockProducts);
  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    let active = true;
    productService.getProducts().then((response) => {
      const payload = response.data;
      const data = Array.isArray(payload) ? payload : payload.results ?? payload.data ?? [];
      // Convert numeric IDs to strings for consistency with URL parameters
      const normalizedData = data.map((product: any) => ({
        ...product,
        id: String(product.id)
      }));
      if (active) setProducts(normalizedData);
    }).catch(() => { if (active) setProducts([]); });
    return () => { active = false; };
  }, []);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname === "/"
    ? "home"
    : location.pathname.startsWith("/product/")
      ? "product-detail"
      : location.pathname.startsWith("/account/orders/")
        ? "account-orders-id"
        : location.pathname.slice(1).replace("/", "-");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { authState } = useAuth();
  const { itemCount: cartItemCount, items: cartItems, groups: cartGroups, subtotal: cartSubtotal, addItem: addCartItem, clearCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    addCartItem(product);
  };

  const handleViewDetails = (productId: string) => {
    setSelectedProductId(productId);
    navigate(`/product/${productId}`);
  };

  const handleViewVendor = (vendorId: string) => {
    navigate(`/vendor/${vendorId}`);
  };

  const handlePageChange = (page: string) => {
    const paths: Record<string, string> = {
      home: "/",
      products: "/products",
      vendors: "/vendors",
      categories: "/categories",
      cart: "/cart",
      checkout: "/checkout",
      "account-orders": "/account/orders",
      login: "/login",
      register: "/register",
      "become-vendor": "/become-vendor",
      profile: "/profile",
      wishlist: "/wishlist",
      messaging: "/messaging",
      "message-templates": "/message-templates",
      "conversation-history": "/conversation-history",
      "vendor-dashboard": "/vendor/dashboard",
      "admin-dashboard": "/admin/dashboard",
      admin: "/admin",
      "admin-vendors": "/admin/vendors",
      "admin-products": "/admin/products",
      "admin-orders": "/admin/orders",
      "admin-users": "/admin/users",
      "admin-categories": "/admin/categories",
      "admin-settings": "/admin/settings",
    };
    navigate(paths[page] || "/404");
    if (page !== "product-detail") {
      setSelectedProductId(null);
    }
    // Reset category filters when changing pages
    if (page !== "products") {
      setSelectedCategoryId(null);
      setSelectedSubCategoryId(null);
    }
  };

  const handleCategorySelect = (categoryId: string, subCategoryId?: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(subCategoryId || null);
  };

  const handleBack = () => {
    navigate("/products");
    setSelectedProductId(null);
  };

  const routeProductId = location.pathname.startsWith("/product/")
    ? location.pathname.split("/")[2]
    : null;
  const selectedProduct = products.find(p => p.id === (routeProductId || selectedProductId)) || null;
  const relatedProducts = selectedProduct
    ? products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    : [];

  const renderCurrentPage = () => {
    // Pages d'authentification
    if (currentPage === "login") {
      return authMode === 'login' ? (
        <LoginPage
          onBack={() => {
            if (redirectAfterAuth === "checkout") {
              navigate("/checkout");
              setRedirectAfterAuth(null);
            } else {
              navigate("/");
            }
          }}
          onSwitchToRegister={() => setAuthMode('register')}
          redirectAfterLogin={redirectAfterAuth || undefined}
        />
      ) : (
        <RegisterPage
          onBack={() => {
            if (redirectAfterAuth === "checkout") {
              navigate("/checkout");
              setRedirectAfterAuth(null);
            } else {
              navigate("/");
            }
          }}
          onSwitchToLogin={() => setAuthMode('login')}
          redirectAfterRegister={redirectAfterAuth || undefined}
        />
      );
    }

    // Pages administrateur
    if (currentPage.startsWith("admin")) return <AdminCenter />;

    // Pages vendeur
    if (currentPage === "vendor-dashboard") {
      return <VendorDashboard onPageChange={handlePageChange} />;
    }

    if (currentPage.startsWith("vendor-")) {
      return (
        <VendorStorePage
          vendorId={currentPage.replace("vendor-", "")}
          products={products}
          onBack={() => navigate("/vendors")}
          onViewDetails={handleViewDetails}
          onAddToCart={handleAddToCart}
          onViewVendor={handleViewVendor}
        />
      );
    }

    // Pages publiques
    switch (currentPage) {
      case "home":
        return {
          fullWidth: <HeroBanner onPageChange={handlePageChange} />,
          content: (
            <HomePage
              featuredProducts={products}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
              onPageChange={handlePageChange}
            />
          )
        };
      case "categories":
        return (
          <CategoriesPage
            onCategorySelect={handleCategorySelect}
            onPageChange={handlePageChange}
          />
        );
      case "products":
        return (
          <ProductsPage
            products={products}
            onViewDetails={handleViewDetails}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            selectedCategoryId={selectedCategoryId}
            selectedSubCategoryId={selectedSubCategoryId}
            onPageChange={handlePageChange}
            onViewVendor={handleViewVendor}
          />
        );
      case "vendors":
        return <VendorsPage onOpenVendor={handleViewVendor} />;
      case "cart":
        return (
          <CartPage
            onPageChange={handlePageChange}
          />
        );
      case "checkout":
        return (
          <CheckoutPage
            onBack={() => navigate("/cart")}
            onPlaceOrder={async (paymentMethod: PaymentMethod, customer: OrderCustomer) => {
              const payment = await paymentService.prepare(paymentMethod);
              await orderService.createOrder({
                userId: authState.user?.id || "guest",
                orderNumber: "",
                customer,
                items: cartItems.map(item => ({ id: `${item.productId}-${Date.now()}`, productId: item.productId, productName: item.name, productImage: item.image, price: item.price, quantity: item.quantity, total: item.subtotal, vendorId: item.vendorId, vendorName: item.vendorName })),
                vendors: cartGroups.map(group => ({ id: group.vendorId, vendorId: group.vendorId, vendorName: group.vendorName, items: group.items.map(item => ({ id: item.productId, productId: item.productId, productName: item.name, productImage: item.image, price: item.price, quantity: item.quantity, total: item.subtotal, vendorId: item.vendorId, vendorName: item.vendorName })), status: "pending", deliveryStatus: "pending", subtotal: group.subtotal })),
                subtotal: cartSubtotal,
                tax: 0,
                shipping: cartSubtotal > 50 ? 0 : 5.99,
                discount: 0,
                total: cartSubtotal + (cartSubtotal > 50 ? 0 : 5.99),
                currency: "XOF",
                paymentStatus: payment.status,
                paymentMethod,
                paymentProvider: payment.provider,
                shippingInfo: { method: "standard", cost: cartSubtotal > 50 ? 0 : 5.99, estimatedDays: 3, address: { firstName: customer.name, lastName: "", address1: customer.address, city: customer.city, state: "", postalCode: "", country: "TG", phone: customer.phone } },
                orderDate: new Date(),
              });
              clearCart();
            }}
          />
        );
      case "product-detail":
        return (
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={handleBack}
            relatedProducts={relatedProducts}
            onViewDetails={handleViewDetails}
            onPageChange={handlePageChange}
          />
        );
      case "profile":
        return <OrdersPage />;
      case "become-vendor":
        return <BecomeVendorPage />;
      case "account-orders":
        return <OrdersPage />;
      case "account-orders-id":
        return <OrderDetailPage orderId={location.pathname.split("/")[3]} />;
      case "wishlist":
        return (
          <WishlistPage
            onPageChange={handlePageChange}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        );
      case "messaging":
        return <MessagingPage onPageChange={handlePageChange} />;
      case "message-templates":
        return <MessageTemplatesPage onPageChange={handlePageChange} />;
      case "conversation-history":
        return <ConversationHistory onPageChange={handlePageChange} />;
      default:
        return {
          fullWidth: <HeroBanner onPageChange={handlePageChange} />,
          content: (
            <HomePage
              featuredProducts={products}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
              onPageChange={handlePageChange}
            />
          )
        };
    }
  };

  const currentPageData = renderCurrentPage();
  const pageLayout = !isValidElement(currentPageData)
    && currentPageData !== null
    && typeof currentPageData === "object"
    && "content" in currentPageData
    ? currentPageData
    : null;
  const pageContent = pageLayout
    ? pageLayout.content
    : isValidElement(currentPageData)
      ? currentPageData
      : null;
  const isHomePage = currentPage === "home" || currentPage === "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        cartItemCount={cartItemCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={products}
      />

      {/* Full-width banner for home page */}
      {isHomePage && pageLayout?.fullWidth}

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-1 w-full">
        <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center" role="status">Chargement de la page...</div>}>
        <AppRouter
          home={pageContent}
          products={pageContent}
          product={pageContent}
          cart={pageContent}
          checkout={pageContent}
          login={pageContent}
          register={pageContent}
          becomeVendor={pageContent}
          vendorDashboard={pageContent}
          adminDashboard={<AdminCenter />}
          adminVendors={<AdminCenter />}
          adminProducts={<AdminCenter />}
          adminOrders={<AdminCenter />}
          adminUsers={<AdminCenter />}
          adminCategories={<AdminCenter />}
          adminAudits={<AdminCenter />}
          adminSettings={<AdminCenter />}
          vendors={pageContent}
          vendorStore={pageContent}
          orders={pageContent}
          orderDetail={pageContent}
        />
        </Suspense>
      </main>
      <Footer onPageChange={handlePageChange} />

      {/* Message notifications */}
      <MessageNotifications onPageChange={handlePageChange} />

      {/* Toast notifications container */}
      <ToastContainer />
    </div>
  );
}
