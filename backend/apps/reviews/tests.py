from rest_framework.test import APITestCase
from apps.users.models import User
from apps.products.models import Category, Product
from apps.orders.models import Order, OrderItem

class ReviewContractTests(APITestCase):
    def test_reviews_are_public_and_create_requires_auth(self):
        self.assertEqual(self.client.get('/api/reviews/?target_type=product&target_id=1').status_code, 200)
        self.assertEqual(self.client.post('/api/reviews/', {
            'targetType': 'product', 'targetId': 1, 'rating': 5, 'comment': 'Great',
        }, format='json').status_code, 401)
        user = User.objects.create_user('review@example.com', 'secret123')
        vendor = User.objects.create_user('review-vendor@example.com', 'secret123', user_type='vendor')
        from apps.users.models import VendorProfile
        profile = VendorProfile.objects.create(user=vendor, store_name='Review Shop')
        product = Product.objects.create(vendor=profile, category=Category.objects.create(name='Reviews'),
                                          name='Review product', description='Test', price=10, quantity=1)
        order = Order.objects.create(customer=user, order_number='AM-REVIEW-TEST', status='delivered',
                                     subtotal=10, total=10, shipping_address={'city': 'Paris'})
        OrderItem.objects.create(order=order, product=product, quantity=1, price=10, total=10)
        self.client.force_authenticate(user)
        response = self.client.post('/api/reviews/', {
            'targetType': 'product', 'targetId': product.pk, 'rating': 5, 'comment': 'Great',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('createdAt', response.data)

    def test_review_requires_delivered_purchase_and_existing_target(self):
        user = User.objects.create_user('review-owner@example.com', 'secret123')
        self.client.force_authenticate(user)
        response = self.client.post('/api/reviews/', {
            'targetType': 'product', 'targetId': 9999, 'rating': 5, 'comment': 'Nope',
        }, format='json')
        self.assertEqual(response.status_code, 400)
