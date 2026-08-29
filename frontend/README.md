# 🛒 AraMarket - Marketplace E-commerce Avancé

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-0052CC?style=for-the-badge&logo=motion&logoColor=white)](https://motion.dev/)
[![ShadcnUI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

> **AraMarket** est une marketplace e-commerce moderne et complète développée avec React TypeScript. La plateforme intègre un système de communication avancé entre vendeurs et acheteurs, une gestion multi-utilisateurs sophistiquée, et une expérience utilisateur optimisée basée sur une palette triadique (Bleu, Jaune, Blanc).

---

## 🌟 **Fonctionnalités Principales**

### 🛍️ **Expérience Client Complète**
- **Navigation intuitive** avec recherche avancée et filtrage intelligent
- **Système de favoris/wishlist** avec partage social et notifications
- **Panier d'achat persistant** avec sauvegarde automatique et reprise de session
- **Reviews et avis** avec photos, vérification d'achat et modération
- **Recommandations IA** basées sur l'historique et le comportement
- **Suivi de commandes** en temps réel avec géolocalisation

### 💬 **Communication Avancée Vendeur-Acheteur**
- **Messagerie en temps réel** avec chat instantané et historique
- **Templates de messages** pré-définis et personnalisables
- **Système d'évaluation** des conversations et qualité de service
- **Notifications push** pour les nouveaux messages et réponses
- **Partage de fichiers** et images dans les conversations
- **Traduction automatique** pour communication multilingue
- **Statuts de livraison** et suivi partagé en temps réel

### 👥 **Écosystème Multi-Utilisateurs**
- **Visiteurs** : Navigation libre avec panier persistant
- **Clients** : Profil complet, historique, favoris et communication
- **Vendeurs** : Dashboard avancé avec analytics, messagerie et gestion
- **Administrateurs** : Supervision complète avec outils de modération

### 🌍 **Internationalisation Complète**
- **Langues** : Français et Anglais avec traduction automatique
- **Devises** : EUR, USD, XOF avec taux de change temps réel
- **Localisation** : Adaptation culturelle, fiscale et logistique
- **Fuseaux horaires** : Gestion automatique pour communications

### 📱 **Experience PWA Native**
- **Installation native** cross-platform (iOS, Android, Desktop)
- **Notifications push** multi-canal (commandes, messages, promotions)
- **Mode hors ligne** avec synchronisation intelligente
- **Partage natif** de produits et listes de souhaits

---

## 🎨 **Design System**

### **Palette Triadique**
```css
/* Couleurs principales */
--primary: oklch(0.5 0.15 250);     /* Bleu #0066CC */
--secondary: oklch(0.85 0.12 85);   /* Jaune #FFD700 */
--accent: oklch(0.88 0.15 85);      /* Jaune accent */
--background: #ffffff;              /* Blanc */
```

### **Typography**
- **Police** : System fonts optimisées pour la lisibilité
- **Hiérarchie** : H1-H4 avec tailles et poids cohérents
- **Responsive** : Adaptation automatique selon l'écran

### **Composants UI**
- **ShadcnUI** : Bibliothèque de composants moderne
- **Motion/React** : Animations fluides et micro-interactions
- **Responsive Design** : Mobile-first avec breakpoints optimisés

---

## 🏗️ **Architecture Technique**

### **Architecture Complète du Projet**
```
📁 AraMarket/
├── 📄 App.tsx                     # Point d'entrée principal
├── 📁 components/                 # Composants React réutilisables
│   ├── 📁 ui/                    # Composants ShadcnUI (40+ composants)
│   ├── 📁 auth/                  # Authentification (Login, Register)
│   ├── 📁 admin/                 # Dashboard admin avec modération
│   ├── 📁 vendor/                # Dashboard vendeur avec analytics
│   ├── 📁 figma/                 # Composants d'intégration Figma
│   ├── 📄 MessagingPage.tsx      # Communication temps réel
│   ├── 📄 MessageTemplatesPage.tsx # Gestion templates messages
│   ├── 📄 ConversationHistory.tsx # Historique conversations
│   ├── 📄 MessageNotifications.tsx # Notifications messagerie
│   ├── 📄 ContactVendorButton.tsx # Bouton contact vendeur
│   ├── 📄 ConversationRating.tsx # Évaluation conversations
│   ├── 📄 MessageStats.tsx       # Statistiques communication
│   ├── 📄 ProductDetailPage.tsx  # Détail produit avec contact
│   ├── 📄 Navigation.tsx         # Navigation principale
│   ├── 📄 HomePage.tsx           # Page d'accueil
│   ├── 📄 ProductsPage.tsx       # Catalogue produits
│   ├── 📄 CartPage.tsx           # Panier d'achat
│   ├── 📄 CheckoutPage.tsx       # Processus de commande
│   ├── 📄 ProfilePage.tsx        # Profil utilisateur
│   ├── 📄 WishlistPage.tsx       # Liste de favoris
│   └── 📄 ...                    # 25+ autres composants
├── 📁 contexts/                   # Gestion d'état global
│   ├── 📄 AuthContext.tsx        # Authentification multi-rôles
│   ├── 📄 MessageContext.tsx     # Communication temps réel
│   ├── 📄 LocalizationContext.tsx # Internationalisation
│   ├── 📄 NotificationContext.tsx # Notifications multi-canal
│   ├── 📄 WishlistContext.tsx    # Favoris et partage
│   ├── 📄 ReviewContext.tsx      # Avis et évaluations
│   ├── 📄 CouponContext.tsx      # Promotions et coupons
│   └── 📄 CategoryContext.tsx    # Gestion catégories
├── 📁 types/                      # Types TypeScript
│   ├── 📄 auth.ts               # Types authentification
│   ├── 📄 message.ts            # Types communication
│   ├── 📄 product.ts            # Types produits
│   ├── 📄 order.ts              # Types commandes
│   ├── 📄 notification.ts       # Types notifications
│   └── 📄 category.ts           # Types catégories
├── 📁 styles/                    # Styles et design system
│   └── 📄 globals.css           # Tailwind V4 avec palette triadique
├── 📁 guidelines/                # Documentation
│   └── 📄 Guidelines.md         # Guidelines de développement
├── 📄 README.md                 # Documentation complète
└── 📄 Attributions.md           # Crédits et licences
```

### **Contextes & État Global**
- **AuthContext** : Authentification multi-rôles avec JWT et sessions
- **LocalizationContext** : Internationalisation complète (langues/devises)
- **NotificationContext** : Notifications push, toast et en temps réel
- **WishlistContext** : Favoris avec partage social et persistance
- **MessageContext** : Communication temps réel vendeur-acheteur
- **ReviewContext** : Système d'avis et évaluations avancé
- **CouponContext** : Gestion des promotions et codes de réduction
- **CategoryContext** : Architecture de catégories dynamique

### **Types TypeScript Complets**
- **Product** : Interface produit avec variants, stock et SEO
- **Order** : Commandes avec statuts, livraison et paiements
- **User** : Utilisateurs multi-rôles avec préférences et historique
- **Message** : Communication avec templates, évaluations et modération
- **Notification** : Notifications typées avec préférences utilisateur
- **Category** : Catégories hiérarchiques avec métadonnées

---

## 🚀 **Fonctionnalités Avancées**

### 🔍 **Recherche & Découverte IA**
```typescript
// Moteur de recherche intelligent avec IA
- Recherche sémantique et corrections automatiques
- Filtres dynamiques multi-critères avancés
- Suggestions contextuelles en temps réel
- Historique intelligent et recherches sauvegardées
- Reconnaissance vocale et recherche par image
```

### 💬 **Communication Marketplace Complète**
```typescript
// Système de messagerie vendeur-acheteur avancé
- Chat temps réel avec WebSockets
- Templates de messages personnalisables
- Système d'évaluation des conversations (1-5 étoiles)
- Partage de fichiers et médias
- Traduction automatique intégrée
- Notifications push intelligentes
- Historique complet avec recherche
- Modération automatique et manuelle
- Analytics de communication pour vendeurs
```

### ❤️ **Favoris & Social Commerce**
```typescript
// Wishlist sociale et partage communautaire
- Listes multiples et organisées par collections
- Partage public avec liens personnalisés
- Notifications de prix et disponibilité
- Synchronisation cloud multi-appareils
- Recommandations basées sur les favoris partagés
```

### 🔔 **Notifications Omnicanal**
```typescript
// Système de notifications multi-canal sophistiqué
- Push notifications natives (web/mobile)
- Notifications in-app temps réel
- Email avec templates responsive
- SMS pour commandes critiques
- Préférences granulaires par type/canal
- Analytics d'engagement des notifications
```

### 📊 **IA & Analytics Avancés**
```typescript
// Intelligence artificielle et analytics poussés
- Recommandations ML basées sur comportement
- Prédiction de demande et gestion stock
- Analyse sentiment des avis clients
- Détection de fraude automatisée
- Optimisation prix dynamique
- Heatmaps et parcours utilisateur
- A/B testing intégré
```

### 🛡️ **Modération & Confiance**
```typescript
// Système de confiance et sécurité
- Vérification vendeurs avec KYC
- Système de badges et certifications
- Modération automatique contenu/messages
- Signalement communautaire
- Arbitrage disputes intégré
- Blacklist et whitelist automatiques
```

---

## 🛠️ **Technologies Utilisées**

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18+ | Framework frontend |
| **TypeScript** | 5+ | Typage statique |
| **Tailwind CSS** | V4 | Styling et design |
| **Motion/React** | Latest | Animations |
| **ShadcnUI** | Latest | Composants UI |
| **Lucide React** | Latest | Icônes |
| **Recharts** | Latest | Graphiques |

### **Dépendances Clés**
```json
{
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "motion": "latest",
  "lucide-react": "latest",
  "recharts": "latest",
  "react-hook-form": "^7.55.0",
  "sonner": "^2.0.3"
}
```

---

## 🏃‍♂️ **Installation & Configuration**

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Git

### **Installation**
```bash
# Cloner le repository
git clone https://github.com/votre-username/aramarket.git
cd aramarket

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
```

### **Configuration**
```typescript
// Configurer les variables d'environnement
VITE_API_URL=your_api_url
VITE_STRIPE_KEY=your_stripe_key
VITE_FIREBASE_CONFIG=your_firebase_config
```

---

## 📱 **PWA Configuration**

### **Manifest**
```json
{
  "name": "AraMarket",
  "short_name": "AraMarket",
  "description": "Plateforme e-commerce moderne",
  "theme_color": "#0066CC",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

### **Service Worker**
```typescript
// Cache strategy pour offline
- Cache-first pour les assets statiques
- Network-first pour les données dynamiques
- Background sync pour les actions offline
```

---

## 🔐 **Sécurité & Authentification**

### **Système d'Auth**
- **JWT tokens** avec refresh automatique
- **Authentification 2FA** optionnelle
- **Hashage bcrypt** pour les mots de passe
- **Rate limiting** sur les API

### **Protection des Données**
- **Validation** côté client et serveur
- **Sanitisation** des inputs utilisateur
- **HTTPS obligatoire** en production
- **CSP headers** pour la sécurité

---

## 🌐 **API & Backend**

### **Endpoints API Complets**
```typescript
// Authentification & Utilisateurs
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
GET /api/auth/profile
PUT /api/auth/profile
POST /api/auth/2fa/setup
POST /api/auth/logout

// Produits & Catalogue
GET /api/products
GET /api/products/:id
POST /api/products (vendeur)
PUT /api/products/:id (vendeur)
DELETE /api/products/:id (vendeur)
GET /api/products/search
GET /api/categories
GET /api/brands

// Communication & Messages
GET /api/conversations
POST /api/conversations
GET /api/conversations/:id/messages
POST /api/conversations/:id/messages
PUT /api/conversations/:id/rating
GET /api/message-templates
POST /api/message-templates
DELETE /api/message-templates/:id

// Commandes & Paiements
GET /api/orders
POST /api/orders
PUT /api/orders/:id/status
GET /api/orders/:id/tracking
POST /api/payments/process
GET /api/payments/:id/status

// Notifications & Communication
POST /api/notifications/push
GET /api/notifications
PUT /api/notifications/:id/read
GET /api/notifications/preferences
PUT /api/notifications/preferences

// Analytics & Rapports
GET /api/analytics/dashboard (vendeur/admin)
GET /api/analytics/sales (vendeur)
GET /api/analytics/messages (vendeur)
GET /api/analytics/products (vendeur)
POST /api/events/track (analytics)

// Administration
GET /api/admin/users
PUT /api/admin/users/:id/status
GET /api/admin/reports
POST /api/admin/moderate
GET /api/admin/metrics
```

### **Modèles de Données Principaux**
```typescript
// Produit complet avec toutes les fonctionnalités
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  isOnSale: boolean;
  saleEndDate?: Date;
  tags: string[];
  vendorId: string;
  vendorName: string;
  shippingInfo: ShippingInfo;
  dateAdded: Date;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
}

// Message dans le système de communication
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'buyer' | 'seller';
  content: string;
  type: 'text' | 'image' | 'file' | 'template';
  templateId?: string;
  attachments?: MessageAttachment[];
  timestamp: Date;
  isRead: boolean;
  isTranslated?: boolean;
  originalLanguage?: string;
  translatedContent?: string;
}

// Conversation entre vendeur et acheteur
interface Conversation {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  status: 'active' | 'closed' | 'archived';
  rating?: ConversationRating;
  lastMessage?: Message;
  lastActivity: Date;
  isNew: boolean;
  tags: string[];
  metadata: Record<string, any>;
}

// Évaluation de conversation
interface ConversationRating {
  id: string;
  conversationId: string;
  raterId: string;
  raterRole: 'buyer' | 'seller';
  rating: number; // 1-5
  review: string;
  aspects: {
    responsiveness: number;
    helpfulness: number;
    politeness: number;
    knowledgeability: number;
  };
  timestamp: Date;
}

// Template de message
interface MessageTemplate {
  id: string;
  vendorId: string;
  name: string;
  content: string;
  category: 'greeting' | 'info' | 'shipping' | 'support' | 'closing';
  variables: string[]; // Variables comme {{customerName}}, {{productName}}
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📈 **Performance & Optimisation**

### **Core Web Vitals**
- **LCP** < 2.5s : Lazy loading des images
- **FID** < 100ms : Code splitting par routes
- **CLS** < 0.1 : Skeleton loaders

### **Optimisations**
```typescript
// Techniques utilisées
- React.memo() pour les composants
- useMemo() et useCallback() pour les calculs
- Bundle splitting automatique
- Image optimization avec WebP
- Prefetch des routes critiques
```

---

## 🧪 **Tests & Qualité**

### **Tests Unitaires**
```bash
# Jest + React Testing Library
npm run test

# Coverage
npm run test:coverage
```

### **Tests E2E**
```bash
# Playwright
npm run test:e2e
```

### **Linting & Formatting**
```bash
# ESLint + Prettier
npm run lint
npm run format
```

---

## 🚀 **Déploiement**

### **Production Build**
```bash
# Build optimisé
npm run build

# Preview local
npm run preview
```

### **Plateformes Supportées**
- **Vercel** (recommandé)
- **Netlify**
- **AWS S3 + CloudFront**
- **Docker containers**

### **Variables d'Environnement**
```env
# Production
NODE_ENV=production
VITE_API_URL=https://api.aramarket.com
VITE_CDN_URL=https://cdn.aramarket.com
```

---

## 📊 **Analytics & Monitoring**

### **Métriques Avancées**
- **Conversions** : Entonnoir complet avec analyse par canal
- **Communication** : Taux de réponse, satisfaction, temps de résolution
- **Performance** : Core Web Vitals + métriques communication temps réel
- **Engagement** : Messages envoyés, templates utilisés, évaluations
- **Qualité** : Scores vendeurs, satisfaction acheteurs, modération
- **Erreurs** : Tracking automatique avec alertes proactives

### **Dashboards Spécialisés**
- **Vendeurs** : Analytics communication, performance, revenus
- **Acheteurs** : Historique conversations, évaluations données/reçues
- **Administrateurs** : Supervision globale, modération, KPIs plateforme
- **Communication** : Métriques temps réel, tendances, optimisations
- **Business Intelligence** : Insights cross-platform et recommandations

---

## 🔄 **Évolution de la Plateforme**

### **✅ Phase 1 - Fondations (Complétée)**
- [x] **Architecture de base** React TypeScript avec Tailwind
- [x] **Système d'authentification** multi-rôles complet
- [x] **Catalogue produits** avec recherche et filtrage avancés
- [x] **Panier et commandes** avec persistance et suivi
- [x] **Interface responsive** mobile-first optimisée

### **✅ Phase 2 - Expérience Utilisateur (Complétée)**
- [x] **Système de favoris** avec partage social
- [x] **Reviews et évaluations** avec modération
- [x] **Notifications multi-canal** (push, email, in-app)
- [x] **Internationalisation** complète (langues/devises)
- [x] **PWA native** avec installation cross-platform

### **✅ Phase 3 - Communication Avancée (Complétée)**
- [x] **Messagerie temps réel** vendeur-acheteur complète
- [x] **Templates de messages** personnalisables
- [x] **Système d'évaluation** des conversations
- [x] **Notifications intelligentes** pour communications
- [x] **Historique et analytics** de communication
- [x] **Modération automatique** et manuelle des messages
- [x] **Traduction automatique** pour communication multilingue

### **🚧 Phase 4 - IA et Automatisation (En cours)**
- [ ] **Recommandations ML** personnalisées avancées
- [ ] **Chatbots IA** pour support client automatisé
- [ ] **Détection de fraude** avec machine learning
- [ ] **Optimisation prix** dynamique intelligente
- [ ] **Prédiction de demande** pour gestion stock

### **📋 Phase 5 - Expansion (Planifiée Q2 2025)**
- [ ] **App mobile native** React Native/Flutter
- [ ] **API publique** pour intégrations tierces
- [ ] **Marketplace B2B** avec fonctionnalités grossistes
- [ ] **Programme d'affiliation** avancé
- [ ] **Social commerce** avec intégrations réseaux sociaux

### **🔮 Phase 6 - Technologies Émergentes (Q3-Q4 2025)**
- [ ] **Réalité augmentée** pour essayage virtuel
- [ ] **Voice commerce** avec reconnaissance vocale
- [ ] **Blockchain** pour traçabilité et authenticité
- [ ] **Crypto payments** et NFT marketplace
- [ ] **Carbon footprint** tracking et commerce durable

---

## 🤝 **Contribution**

### **Comment Contribuer**
1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### **Guidelines**
- **Code style** : Prettier + ESLint
- **Commits** : Convention Conventional Commits
- **Tests** : Coverage > 80%
- **Documentation** : JSDoc pour les fonctions publiques

---

## 📝 **Licence**

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 **Remerciements**

Merci à tous les contributeurs et à la communauté open source pour les outils utilisés :

- **React Team** pour React
- **Vercel** pour ShadcnUI
- **Tailwind Labs** pour Tailwind CSS
- **Motion** pour les animations
- **Lucide** pour les icônes

---

## 📞 **Contact & Support**

- **Email** : support@aramarket.com
- **Discord** : [Communauté AraMarket](https://discord.gg/aramarket)
- **GitHub Issues** : Pour les bugs et feature requests
- **Documentation** : [docs.aramarket.com](https://docs.aramarket.com)

---

## 📈 **Statistiques du Projet**

| Métrique | Valeur | Description |
|----------|--------|-------------|
| **Composants** | 50+ | Composants React modulaires et réutilisables |
| **Pages** | 15+ | Pages complètes avec fonctionnalités avancées |
| **Contextes** | 8 | Gestion d'état globale sophistiquée |
| **Types TS** | 30+ | Interfaces TypeScript complètes |
| **Features** | 100+ | Fonctionnalités implémentées et testées |
| **Langues** | 2+ | Support multilingue extensible |
| **Rôles** | 4 | Types d'utilisateurs avec permissions |

### **Système de Communication - Statistiques**
- **Messages supportés** : Texte, Images, Fichiers, Templates
- **Langues de traduction** : Auto-détection + 20+ langues
- **Types de notifications** : Push, Email, In-app, SMS
- **Templates pré-définis** : 10+ catégories (Accueil, Info, Support, etc.)
- **Évaluations** : Système 5 étoiles avec 4 aspects détaillés
- **Modération** : Automatique (IA) + Manuelle avec signalement

---

<div align="center">

**AraMarket - Marketplace E-commerce du Futur**

*Développé avec ❤️ et des technologies de pointe pour révolutionner l'e-commerce*

[🌟 Star sur GitHub](https://github.com/votre-username/aramarket) • [🐛 Reporter un Bug](https://github.com/votre-username/aramarket/issues) • [💡 Suggérer une Feature](https://github.com/votre-username/aramarket/discussions) • [💬 Rejoindre la Communauté](https://discord.gg/aramarket)

</div>