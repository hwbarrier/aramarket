# 🚀 AraMarket Backend - API Django

## API contract implementation

The `/api/` routes use the frontend contract in `DJANGO_API_CONTRACT.md`.
Login and registration return a short-lived JWT in `access`; refresh tokens are
rotated in the HttpOnly `aramarket_refresh` cookie. Configure `FRONTEND_URL`,
`CSRF_TRUSTED_ORIGINS` (derived from it), and `DB_ENGINE` in `.env`.

Run locally with `python manage.py migrate` and `python manage.py runserver`.
Notifications remain a frontend-local concern and backend persistence is
intentionally deferred.

[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/Django_REST_Framework-8B0000?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

> **Backend haute performance** pour la marketplace AraMarket - Développé avec Django REST Framework, PostgreSQL et Redis pour une échelle enterprise.

---

## 🏗️ Architecture du Projet
📁 backend/
├── 📁 aramarket/ # Configuration principale Django
│ ├── 📄 settings/
│ │ ├── base.py # Configuration de base
│ │ ├── development.py # Paramètres développement
│ │ └── production.py # Paramètres production
│ ├── 📄 urls.py # Routes principales
│ ├── 📄 asgi.py # Configuration ASGI (WebSockets)
│ └── 📄 wsgi.py # Configuration WSGI
├── 📁 apps/ # Applications métier
│ ├── 📁 users/ # Gestion utilisateurs multi-rôles
│ │ ├── models.py # Modèles User, Profile, Vendor
│ │ ├── api/ # Viewsets et serializers API
│ │ ├── permissions.py # Permissions par rôle
│ │ └── auth.py # Authentification JWT
│ ├── 📁 products/ # Catalogue produits avancé
│ │ ├── models.py # Produits, Catégories, Marques
│ │ ├── api/ # API recherche et filtres
│ │ └── search.py # Moteur de recherche
│ ├── 📁 orders/ # Système de commandes
│ │ ├── models.py # Commandes, Paiements, Livraison
│ │ ├── api/ # API commandes et paiements
│ │ └── payments.py # Intégration Stripe
│ ├── 📁 messaging/ # Communication temps réel
│ │ ├── models.py # Conversations, Messages, Templates
│ │ ├── api/ # API messagerie
│ │ ├── consumers.py # WebSockets Django Channels
│ │ └── routing.py # Routes WebSocket
│ ├── 📁 notifications/ # Système de notifications
│ │ ├── models.py # Notifications, Préférences
│ │ ├── api/ # API notifications
│ │ └── tasks.py # Tâches asynchrones
│ ├── 📁 reviews/ # Avis et évaluations
│ │ ├── models.py # Reviews, Ratings produits/conversations
│ │ └── api/ # API évaluations
│ ├── 📁 analytics/ # Analytics et rapports
│ │ ├── models.py # Métriques et événements
│ │ └── api/ # API dashboard et rapports
│ └── 📁 international/ # Internationalisation
│ ├── models.py # Langues, Devises, Traductions
│ └── api/ # API localisation
├── 📁 shared/ # Utilitaires partagés
│ ├── 📁 models/ # Modèles de base
│ ├── 📁 serializers/ # Serializers communs
│ ├── 📁 permissions/ # Permissions globales
│ ├── 📁 utils/ # Utilitaires
│ └── 📁 middleware/ # Middleware personnalisé
├── 📁 docker/ # Configuration Docker
│ ├── Dockerfile
│ ├── docker-compose.yml
│ └── nginx.conf
├── 📄 requirements.txt # Dépendances Python
├── 📄 manage.py # Script de gestion Django
└── 📄 .env.example # Variables d'environnement

text

---

## 🚀 Démarrage Rapide

### Prérequis
- Python 3.10+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (recommandé)

### 🐳 Installation avec Docker (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/votre-username/aramarket-backend.git
cd aramarket-backend

# Copier les variables d'environnement
cp .env.example .env

# Démarrer les services
docker-compose up -d

# Exécuter les migrations
docker-compose exec backend python manage.py migrate

# Créer un superutilisateur
docker-compose exec backend python manage.py createsuperuser

# Charger les données de test
docker-compose exec backend python manage.py loaddata initial_data
🛠️ Installation Manuelle
bash
# Cloner le repository
git clone https://github.com/votre-username/aramarket-backend.git
cd aramarket-backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configurer la base de données PostgreSQL
# Créer une base de données 'aramarket'

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Exécuter les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
⚙️ Configuration
Variables d'Environnement
env
# Database
DATABASE_URL=postgresql://aramarket:password@localhost:5432/aramarket

# Redis
REDIS_URL=redis://localhost:6379/0

# Django
SECRET_KEY=votre-secret-key-super-securise
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.render.com

# CORS
CORS_ALLOWED_ORIGINS=https://aramarket.onrender.com,http://localhost:3000

# JWT
JWT_SECRET_KEY=votre-jwt-secret
JWT_EXPIRATION_DELTA_DAYS=7

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AWS S3 (optionnel)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=aramarket-media
🗄️ Base de Données PostgreSQL
Modèles Principaux
python
# Schéma simplifié des modèles principaux

# Utilisateurs Multi-Rôles
User (AbstractUser)
├── role: visitor|customer|vendor|admin
├── phone, avatar, preferred_language, currency
├── is_verified, vendor_profile (OneToOne)
└── created_at, updated_at

VendorProfile
├── user (OneToOne), company_name, description
├── rating, response_time, is_featured
└── verification_status, business_documents

# Produits & Catalogue
Product
├── vendor (ForeignKey), name, description, price
├── category (ForeignKey), brand, sku
├── images (JSONField), specifications (JSONField)
├── stock_quantity, is_active, is_featured
├── rating, review_count
└── created_at, updated_at

Category
├── name, description, image
├── parent (ForeignKey - self), is_active
└── metadata (JSONField)

# Commandes & Paiements
Order
├── customer (ForeignKey), order_number, status
├── total_amount, shipping_address (JSONField)
├── payment_status, payment_method
├── stripe_payment_intent_id
└── created_at, updated_at

OrderItem
├── order (ForeignKey), product (ForeignKey)
├── quantity, unit_price, total_price
└── vendor (ForeignKey)

# Communication Temps Réel
Conversation
├── product (ForeignKey), buyer (ForeignKey), seller (ForeignKey)
├── status: active|closed|archived
├── last_activity, is_new
└── created_at

Message
├── conversation (ForeignKey), sender (ForeignKey)
├── content, message_type: text|image|file|template
├── template (ForeignKey), is_read
├── attachments (JSONField)
└── created_at

MessageTemplate
├── vendor (ForeignKey), name, content, category
├── variables (JSONField), is_active
├── usage_count
└── created_at, updated_at

# Évaluations & Avis
ProductReview
├── product (ForeignKey), customer (ForeignKey)
├── rating (1-5), title, comment
├── images (JSONField), is_verified_purchase
├── likes, dislikes
└── created_at, updated_at

ConversationRating
├── conversation (OneToOne), rater (ForeignKey)
├── rating (1-5), review
├── aspects (JSONField): responsiveness, helpfulness, etc.
└── created_at
🔌 API Endpoints
Authentification & Utilisateurs
http
POST   /api/auth/register/          # Inscription
POST   /api/auth/login/             # Connexion JWT
POST   /api/auth/logout/            # Déconnexion
POST   /api/auth/refresh/           # Rafraîchir token
GET    /api/auth/profile/           # Profil utilisateur
PUT    /api/auth/profile/           # Modifier profil
POST   /api/auth/verify-email/      # Vérification email
POST   /api/auth/password-reset/    # Réinitialisation mot de passe
Produits & Catalogue
http
GET    /api/products/               # Liste produits (avec filtres)
POST   /api/products/               # Créer produit (vendeur)
GET    /api/products/{id}/          # Détail produit
PUT    /api/products/{id}/          # Modifier produit (vendeur)
DELETE /api/products/{id}/          # Supprimer produit (vendeur)
GET    /api/products/search/        # Recherche avancée
GET    /api/categories/             # Catégories
GET    /api/brands/                 # Marques
Communication & Messagerie
http
GET    /api/conversations/          # Liste conversations
POST   /api/conversations/          # Démarrer conversation
GET    /api/conversations/{id}/     # Détail conversation
GET    /api/conversations/{id}/messages/  # Messages conversation
POST   /api/conversations/{id}/messages/  # Envoyer message
PUT    /api/conversations/{id}/rating/    # Évaluer conversation
GET    /api/message-templates/      # Templates messages
POST   /api/message-templates/      # Créer template
PUT    /api/message-templates/{id}/ # Modifier template
DELETE /api/message-templates/{id}/ # Supprimer template
Commandes & Paiements
http
GET    /api/orders/                 # Liste commandes
POST   /api/orders/                 # Créer commande
GET    /api/orders/{id}/            # Détail commande
PUT    /api/orders/{id}/status/     # Modifier statut
GET    /api/orders/{id}/tracking/   # Suivi livraison
POST   /api/payments/process/       # Traiter paiement
GET    /api/payments/{id}/status/   # Statut paiement
WebSockets - Communication Temps Réel
javascript
// Connexion à une conversation
ws://localhost:8000/ws/conversations/{conversation_id}/

// Événements supportés
{
  "type": "message",
  "content": "Hello world",
  "conversation_id": "123"
}

{
  "type": "typing",
  "conversation_id": "123",
  "is_typing": true
}

{
  "type": "message_read",
  "message_id": "456"
}
🛠️ Commandes Utiles
Développement
bash
# Appliquer les migrations
python manage.py migrate

# Créer les migrations
python manage.py makemigrations

# Charger les données initiales
python manage.py loaddata initial_data

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer les tests
python manage.py test

# Vérifier la sécurité
python manage.py check --deploy
Production
bash
# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Optimiser la base de données
python manage.py optimize_images

# Sauvegarder la base de données
python manage.py dumpdata --indent=2 > backup.json

# Surveillance des performances
python manage.py showmigrations
python manage.py dbshell
🧪 Tests & Qualité
bash
# Lancer tous les tests
python manage.py test

# Tests avec couverture
coverage run manage.py test
coverage report

# Tests spécifiques
python manage.py test apps.users.tests
python manage.py test apps.messaging.tests.ApiTests

# Linting et formatage
flake8 .
black .
isort .
🚀 Déploiement
Déploiement sur Render
yaml
# render.yaml
services:
  - type: web
    name: aramarket-backend
    env: python
    plan: free
    buildCommand: |
      pip install -r requirements.txt
      python manage.py collectstatic --noinput
      python manage.py migrate
    startCommand: gunicorn aramarket.wsgi:application
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: aramarket-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
Déploiement avec Docker
bash
# Build et déploiement
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Surveillance des logs
docker-compose logs -f backend

# Backup base de données
docker-compose exec db pg_dump -U aramarket aramarket > backup.sql
📊 Monitoring & Performance
Métriques Clés
Temps de réponse API : < 200ms

Disponibilité : 99.9%

Concurrent WebSocket : 10,000+ connections

Taux de cache Redis : > 90%

Outils de Monitoring
Django Debug Toolbar (développement)

Sentry (erreurs en production)

Prometheus + Grafana (métriques)

PgHero (performance PostgreSQL)

🔐 Sécurité
Mesures Implémentées
✅ JWT Authentication avec refresh tokens

✅ CORS configuré pour le frontend

✅ Rate Limiting sur les APIs sensibles

✅ Validation des données avec serializers

✅ Hashage des mots de passe (bcrypt)

✅ Protection CSRF et XSS

✅ HTTPS obligatoire en production

✅ Sanitisation des uploads

Permissions Multi-Rôles
python
# Exemple de permissions
class IsVendorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'vendor'
🤝 Contribution
Processus de Contribution
Fork le repository

Créer une branche : git checkout -b feature/nouvelle-fonctionnalite

Commit : git commit -m 'feat: ajouter nouvelle fonctionnalité'

Push : git push origin feature/nouvelle-fonctionnalite

Pull Request

Standards de Code
Conventional Commits pour les messages de commit

Black pour le formatage

Flake8 pour le linting

Tests unitaires requis pour nouvelles fonctionnalités

📞 Support & Contact
Documentation API : /api/docs/ (Redoc)

Issues : GitHub Issues

Email : agbokpeablamvi@gmail.com

Discord : Communauté Développeurs

📝 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.