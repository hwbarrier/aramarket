from decimal import Decimal
from pathlib import Path
from urllib.request import urlretrieve

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.commissions.models import Commission
from apps.orders.models import Order, OrderItem
from apps.products.models import Category, Product, ProductImage
from apps.reviews.models import Review
from apps.users.models import User, VendorProfile


PASSWORD = 'DemoPass123!'


def download_seed_image(seed: str) -> Path:
    destination_dir = Path(settings.MEDIA_ROOT) / 'seed' / 'products'
    destination_dir.mkdir(parents=True, exist_ok=True)
    destination = destination_dir / f'{seed}.jpg'
    if not destination.exists():
        url = f'https://picsum.photos/seed/{seed}/1200/900'
        urlretrieve(url, destination)
    return destination


class Command(BaseCommand):
    help = 'Seed a rich, investor-friendly local marketplace with approved vendors and historical orders.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset the database to a clean state and reseed the demo dataset.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write('Resetting database before seeding demo data...')
            call_command('flush', interactive=False, verbosity=0)
            call_command('migrate', verbosity=0)

        emails = [
            'admin.demo@aramarket.local',
            'vendor.lumiere@aramarket.local',
            'vendor.atelier@aramarket.local',
            'vendor.terra@aramarket.local',
            'vendor.northpeak@aramarket.local',
            'vendor.astera@aramarket.local',
            'vendor.pending@aramarket.local',
            'client.one@aramarket.local',
            'client.two@aramarket.local',
            'demo.client1@aramarket.test',
            'demo.client2@aramarket.test',
            'demo.vendor.applicant@aramarket.test',
        ]

        User.objects.filter(email__in=emails).delete()
        Category.objects.filter(name__in=['Electronics', 'Fashion', 'Home & Living', 'Wellness', 'Food & Beverage', 'Outdoor']).delete()

        admin = User.objects.create_superuser(
            email='admin.demo@aramarket.local',
            password=PASSWORD,
            first_name='Demo',
            last_name='Admin',
        )

        vendor_specs = [
            {'email': 'vendor.lumiere@aramarket.local', 'first_name': 'Lina', 'last_name': 'Moreau', 'store_name': 'Lumière & Co', 'description': 'Mode premium, accessoires raffinés et silhouettes minimalistes.', 'approval_status': 'approved', 'rating': Decimal('4.8')},
            {'email': 'vendor.atelier@aramarket.local', 'first_name': 'Nina', 'last_name': 'Ibrahim', 'store_name': 'Atelier Sora', 'description': 'Décoration intérieure, objets artisanaux et pièces de maison durables.', 'approval_status': 'approved', 'rating': Decimal('4.7')},
            {'email': 'vendor.terra@aramarket.local', 'first_name': 'Yves', 'last_name': 'Koffi', 'store_name': 'Terra Kitchen', 'description': 'Épicerie fine et cadeaux gourmands pour une table inspirée.', 'approval_status': 'approved', 'rating': Decimal('4.9')},
            {'email': 'vendor.northpeak@aramarket.local', 'first_name': 'Hugo', 'last_name': 'Melo', 'store_name': 'North Peak', 'description': 'Équipement outdoor pensé pour les aventures urbaines et gourmandes de nature.', 'approval_status': 'approved', 'rating': Decimal('4.6')},
            {'email': 'vendor.astera@aramarket.local', 'first_name': 'Amina', 'last_name': 'Diallo', 'store_name': 'Astera Wellness', 'description': 'Bien-être, routines sans stress et essentiels de beauté du quotidien.', 'approval_status': 'approved', 'rating': Decimal('4.8')},
            {'email': 'vendor.pending@aramarket.local', 'first_name': 'Pending', 'last_name': 'Vendor', 'store_name': 'Boulevard Studio', 'description': 'Candidature vendeur en attente de validation.', 'approval_status': 'pending', 'rating': Decimal('0.0')},
        ]

        categories = {
            'Electronics': Category.objects.create(name='Electronics', name_key='electronics', description='Audio, objets connectés et gadgets utiles.'),
            'Fashion': Category.objects.create(name='Fashion', name_key='fashion', description='Mode premium, essentials et textures maîtrisées.'),
            'Home & Living': Category.objects.create(name='Home & Living', name_key='home-living', description='Maison, décoration et pièces utiles au quotidien.'),
            'Wellness': Category.objects.create(name='Wellness', name_key='wellness', description='Belle peau, bien-être et routine du soir.'),
            'Food & Beverage': Category.objects.create(name='Food & Beverage', name_key='food-beverage', description='Produits gourmands, boissons et épices sélectionnées.'),
            'Outdoor': Category.objects.create(name='Outdoor', name_key='outdoor', description='Randonnée, sport et aventure en ville.'),
        }

        vendor_profiles = []
        for spec in vendor_specs:
            user = User.objects.create_user(
                email=spec['email'],
                password=PASSWORD,
                first_name=spec['first_name'],
                last_name=spec['last_name'],
                user_type='vendor',
                is_email_verified=True,
            )
            vendor = VendorProfile.objects.create(
                user=user,
                store_name=spec['store_name'],
                store_description=spec['description'],
                is_approved=spec['approval_status'] == 'approved',
                approval_status=spec['approval_status'],
                approved_at=timezone.now() if spec['approval_status'] == 'approved' else None,
                rating=spec['rating'],
            )
            vendor_profiles.append(vendor)

        client_one = User.objects.create_user(
            email='client.one@aramarket.local',
            password=PASSWORD,
            first_name='Demo',
            last_name='Client',
            user_type='customer',
            is_email_verified=True,
        )
        client_two = User.objects.create_user(
            email='client.two@aramarket.local',
            password=PASSWORD,
            first_name='Second',
            last_name='Client',
            user_type='customer',
            is_email_verified=True,
        )

        demo_client_one = User.objects.create_user(
            email='demo.client1@aramarket.test',
            password=PASSWORD,
            first_name='Demo',
            last_name='Client 1',
            user_type='customer',
            is_email_verified=True,
        )
        demo_client_two = User.objects.create_user(
            email='demo.client2@aramarket.test',
            password=PASSWORD,
            first_name='Demo',
            last_name='Client 2',
            user_type='customer',
            is_email_verified=True,
        )
        demo_vendor_applicant = User.objects.create_user(
            email='demo.vendor.applicant@aramarket.test',
            password=PASSWORD,
            first_name='Demo',
            last_name='Applicant',
            user_type='customer',
            is_email_verified=True,
        )

        product_specs = [
            {'vendor': vendor_profiles[0], 'category': categories['Fashion'], 'name': 'Leviere Wool Coat', 'description': 'Manteau léger en laine mérinos, coupe structurée et impeccable pour la saison fraîche.', 'price': Decimal('189.00'), 'compare_price': Decimal('249.00'), 'quantity': 6, 'brand': 'Lumière & Co', 'sku': 'LUM-COAT-01', 'tags': ['premium', 'outerwear', 'minimal'], 'seed': 'lumiere-coat', 'review': {'rating': 5, 'comment': 'Très belle coupe, matière premium et finition soignée.'}},
            {'vendor': vendor_profiles[0], 'category': categories['Fashion'], 'name': 'Arden Leather Tote', 'description': 'Sac fourre-tout en cuir vegan, poche intérieure et anse renforcée pour les trajets quotidiens.', 'price': Decimal('124.00'), 'compare_price': Decimal('169.00'), 'quantity': 9, 'brand': 'Lumière & Co', 'sku': 'LUM-TOTE-02', 'tags': ['accessories', 'leather', 'gift'], 'seed': 'lumiere-tote', 'review': {'rating': 4, 'comment': 'Très chic et très pratique pour le boulot.'}},
            {'vendor': vendor_profiles[0], 'category': categories['Fashion'], 'name': 'Mira Silk Scarf', 'description': 'Écharpe légère en soie imprimée avec finitions surpiquées et touche luxueuse.', 'price': Decimal('68.00'), 'compare_price': Decimal('92.00'), 'quantity': 18, 'brand': 'Lumière & Co', 'sku': 'LUM-SCARF-03', 'tags': ['scarves', 'gift', 'premium'], 'seed': 'lumiere-scarf', 'review': {'rating': 5, 'comment': 'Le rendu visuel est très chic et la matière est douce.'}},
            {'vendor': vendor_profiles[1], 'category': categories['Home & Living'], 'name': 'Solène Ceramic Vase', 'description': 'Vase artisanal en céramique avec surface mate et design équilibré pour la table et le salon.', 'price': Decimal('88.00'), 'compare_price': Decimal('110.00'), 'quantity': 5, 'brand': 'Atelier Sora', 'sku': 'SOR-VASE-01', 'tags': ['decor', 'ceramic', 'artisan'], 'seed': 'sora-vase', 'review': {'rating': 5, 'comment': 'Très belle pièce artisanale qui a immédiatement trouvé sa place.'}},
            {'vendor': vendor_profiles[1], 'category': categories['Home & Living'], 'name': 'Luma Linen Cushion Set', 'description': 'Lot de deux coussins en lin naturel, coloris terre et blanc cassé pour un intérieur apaisé.', 'price': Decimal('56.00'), 'compare_price': Decimal('70.00'), 'quantity': 16, 'brand': 'Atelier Sora', 'sku': 'SOR-CUSHION-02', 'tags': ['linen', 'home', 'comfort'], 'seed': 'sora-cushion', 'review': {'rating': 4, 'comment': 'Très beau rendu et matière agréable.'}},
            {'vendor': vendor_profiles[1], 'category': categories['Home & Living'], 'name': 'Néon Mood Lamp', 'description': 'Lampe d’ambiance LED avec variateur d’intensité pour créer une atmosphère douce et moderne.', 'price': Decimal('72.00'), 'compare_price': Decimal('95.00'), 'quantity': 8, 'brand': 'Atelier Sora', 'sku': 'SOR-LAMP-03', 'tags': ['lighting', 'decor', 'ambient'], 'seed': 'sora-lamp', 'review': {'rating': 5, 'comment': 'Parfaite pour le salon, elle change complètement l’ambiance.'}},
            {'vendor': vendor_profiles[2], 'category': categories['Food & Beverage'], 'name': 'Golden Roast Coffee Kit', 'description': 'Coffret café premium avec fèves locales, moulin et instructions de torréfaction douce.', 'price': Decimal('49.00'), 'compare_price': Decimal('68.00'), 'quantity': 14, 'brand': 'Terra Kitchen', 'sku': 'TER-COFFEE-01', 'tags': ['coffee', 'gifts', 'premium'], 'seed': 'terra-coffee', 'review': {'rating': 5, 'comment': 'Mélange très équilibré et beau packaging.'}},
            {'vendor': vendor_profiles[2], 'category': categories['Food & Beverage'], 'name': 'Saffron Harvest Box', 'description': 'Sélection d’épices et de condiments pour exalter les plats de la semaine sans effort.', 'price': Decimal('34.50'), 'compare_price': Decimal('48.00'), 'quantity': 22, 'brand': 'Terra Kitchen', 'sku': 'TER-SPICE-02', 'tags': ['spices', 'gourmet', 'gift'], 'seed': 'terra-spice', 'review': {'rating': 4, 'comment': 'Très bon équilibre, idéale pour une table conviviale.'}},
            {'vendor': vendor_profiles[2], 'category': categories['Food & Beverage'], 'name': 'Citrus Olive Oil', 'description': 'Huile d’olive infusée au citron, parfaite pour salades, grillades et dressage.', 'price': Decimal('27.00'), 'compare_price': Decimal('39.00'), 'quantity': 28, 'brand': 'Terra Kitchen', 'sku': 'TER-OIL-03', 'tags': ['olive-oil', 'gourmet', 'kitchen'], 'seed': 'terra-oil', 'review': {'rating': 5, 'comment': 'Arôme subtil et emballage très premium.'}},
            {'vendor': vendor_profiles[3], 'category': categories['Outdoor'], 'name': 'Summit Trail Pack', 'description': 'Sac à dos de randonnée confortable, points de fixation polyvalents et compartiment tablette.', 'price': Decimal('142.00'), 'compare_price': Decimal('185.00'), 'quantity': 7, 'brand': 'North Peak', 'sku': 'NOP-PACK-01', 'tags': ['outdoor', 'travel', 'hiking'], 'seed': 'north-pack', 'review': {'rating': 5, 'comment': 'Très confortable et bien pensé pour le quotidien comme la randonnée.'}},
            {'vendor': vendor_profiles[3], 'category': categories['Outdoor'], 'name': 'Drift Thermal Bottle', 'description': 'Bouteille isotherme en acier inoxydable, garde l’eau froide jusqu’à 24 heures.', 'price': Decimal('36.00'), 'compare_price': Decimal('49.00'), 'quantity': 21, 'brand': 'North Peak', 'sku': 'NOP-BOTTLE-02', 'tags': ['hydration', 'outdoor', 'travel'], 'seed': 'north-bottle', 'review': {'rating': 4, 'comment': 'Parfaite pour les longues journées, très bien isolée.'}},
            {'vendor': vendor_profiles[3], 'category': categories['Outdoor'], 'name': 'Ridge Trail Hat', 'description': 'Chapeau technique respirant avec visière renforcée et protection légère contre le soleil.', 'price': Decimal('31.00'), 'compare_price': Decimal('42.00'), 'quantity': 12, 'brand': 'North Peak', 'sku': 'NOP-HAT-03', 'tags': ['hiking', 'accessories', 'sun-protection'], 'seed': 'north-hat', 'review': {'rating': 4, 'comment': 'Très léger, finition agréable et couleurs belles.'}},
            {'vendor': vendor_profiles[4], 'category': categories['Wellness'], 'name': 'Cleo Body Oil', 'description': 'Huile corporelle nourrissante aux notes de rose et d’amande, idéale après la douche.', 'price': Decimal('34.00'), 'compare_price': Decimal('45.00'), 'quantity': 17, 'brand': 'Astera Wellness', 'sku': 'AST-OIL-01', 'tags': ['wellness', 'beauty', 'self-care'], 'seed': 'astera-oil', 'review': {'rating': 5, 'comment': 'Texture très agréable et odeur délicate.'}},
            {'vendor': vendor_profiles[4], 'category': categories['Wellness'], 'name': 'Veloura Silk Pillowcase', 'description': 'Taie d’oreiller en soie douce qui aide à garder la peau et les cheveux en bonne santé.', 'price': Decimal('39.00'), 'compare_price': Decimal('53.00'), 'quantity': 26, 'brand': 'Astera Wellness', 'sku': 'AST-PILLOW-02', 'tags': ['sleep', 'beauty', 'wellness'], 'seed': 'astera-pillow', 'review': {'rating': 4, 'comment': 'Très doux et donne une sensation de luxe.'}},
            {'vendor': vendor_profiles[4], 'category': categories['Wellness'], 'name': 'Drift Calm Candle', 'description': 'Bougie parfumée aux notes de lavande, figue et santal pour des soirées apaisées.', 'price': Decimal('28.00'), 'compare_price': Decimal('36.00'), 'quantity': 30, 'brand': 'Astera Wellness', 'sku': 'AST-CANDLE-03', 'tags': ['calm', 'wellness', 'home'], 'seed': 'astera-candle', 'review': {'rating': 5, 'comment': 'Parfum très discret et agréable pour le soir.'}},
        ]

        for idx, spec in enumerate(product_specs, start=1):
            image_path = download_seed_image(spec['seed'])
            product = Product.objects.create(
                vendor=spec['vendor'],
                category=spec['category'],
                name=spec['name'],
                description=spec['description'],
                price=spec['price'],
                compare_price=spec['compare_price'],
                quantity=spec['quantity'],
                is_published=True,
                status='published',
                is_featured=idx % 4 == 0,
                sku=spec['sku'],
                brand=spec['brand'],
                tags=spec['tags'],
                shipping_info={'freeShipping': True, 'estimatedDays': 3, 'cost': 0},
                rating=5 if spec['review']['rating'] >= 5 else 4,
                review_count=24,
            )
            ProductImage.objects.create(
                product=product,
                image=str(image_path.relative_to(Path(settings.MEDIA_ROOT))).replace('\\', '/'),
                alt_text=product.name,
                is_default=True,
            )
            Review.objects.create(
                target_type='product',
                target_id=product.id,
                author=client_one,
                author_name=f'{client_one.first_name} {client_one.last_name}',
                rating=spec['review']['rating'],
                comment=spec['review']['comment'],
            )

        product_map = {product.sku: product for product in Product.objects.all()}

        order_batches = [
            {'order_number': 'AM-INV-1001', 'customer': client_one, 'status': 'delivered', 'payment_status': 'paid', 'product': product_map['LUM-COAT-01'], 'amount': Decimal('189.00'), 'vendor': vendor_profiles[0], 'address': {'address1': '1 Avenue de l’Indépendance', 'city': 'Lomé'}},
            {'order_number': 'AM-INV-1002', 'customer': client_two, 'status': 'shipped', 'payment_status': 'paid', 'product': product_map['SOR-LAMP-03'], 'amount': Decimal('72.00'), 'vendor': vendor_profiles[1], 'address': {'address1': '12 Rue de la Paix', 'city': 'Kara'}},
            {'order_number': 'AM-INV-1003', 'customer': client_one, 'status': 'delivered', 'payment_status': 'paid', 'product': product_map['TER-COFFEE-01'], 'amount': Decimal('49.00'), 'vendor': vendor_profiles[2], 'address': {'address1': '93 Rue des Étoiles', 'city': 'Sokodé'}},
            {'order_number': 'AM-INV-1004', 'customer': client_two, 'status': 'processing', 'payment_status': 'paid', 'product': product_map['NOP-PACK-01'], 'amount': Decimal('142.00'), 'vendor': vendor_profiles[3], 'address': {'address1': '4 Boulevard de la Plage', 'city': 'Atakpamé'}},
            {'order_number': 'AM-INV-1005', 'customer': client_one, 'status': 'delivered', 'payment_status': 'paid', 'product': product_map['AST-OIL-01'], 'amount': Decimal('34.00'), 'vendor': vendor_profiles[4], 'address': {'address1': '22 Avenue du 30 Juin', 'city': 'Dapaong'}},
            {'order_number': 'AM-INV-1006', 'customer': client_two, 'status': 'pending', 'payment_status': 'pending', 'product': product_map['LUM-TOTE-02'], 'amount': Decimal('124.00'), 'vendor': vendor_profiles[0], 'address': {'address1': '57 Rue du Commerce', 'city': 'Aného'}},
        ]

        for item in order_batches:
            order = Order.objects.create(
                customer=item['customer'],
                order_number=item['order_number'],
                status=item['status'],
                payment_status=item['payment_status'],
                subtotal=item['amount'],
                total=item['amount'],
                shipping_cost=Decimal('6.50'),
                tax=Decimal('0.00'),
                currency='XOF',
                shipping_address=item['address'],
            )
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=1,
                price=item['amount'],
                total=item['amount'],
            )
            Commission.objects.create(
                vendor=item['vendor'],
                order=order,
                rate=Decimal('10.00'),
                amount=(item['amount'] * Decimal('0.10')).quantize(Decimal('0.01')),
                payout=item['amount'] - (item['amount'] * Decimal('0.10')).quantize(Decimal('0.01')),
                status='paid' if order.status in ['delivered', 'shipped'] else 'pending',
            )

        self.stdout.write(self.style.SUCCESS('Demo data seeded successfully.'))
        self.stdout.write(f'Admin user: {admin.email} / {PASSWORD}')
        self.stdout.write(f'Client user: client.one@aramarket.local / {PASSWORD}')
        self.stdout.write(f'Approved vendors: {", ".join(v.store_name for v in vendor_profiles[:5])}')
        self.stdout.write(f'Pending vendor: {vendor_profiles[5].store_name}')
