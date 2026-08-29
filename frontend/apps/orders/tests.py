from rest_framework.test import APITestCase
from apps.users.models import User, VendorProfile
from apps.products.models import Category, Product
from .models import Order

class OrderContractTests(APITestCase):
    def setUp(self):
        self.buyer = User.objects.create_user('buyer-test@example.com', 'secret123')
        vendor_user = User.objects.create_user('order-vendor@example.com', 'secret123', user_type='vendor')
        vendor = VendorProfile.objects.create(user=vendor_user, store_name='Order Shop',
                                              is_approved=True, approval_status='approved')
        product = Product.objects.create(vendor=vendor, category=Category.objects.create(name='Orders'),
                                          name='Order product', description='A product', price=12,
                                          quantity=5, is_published=True, status='published')
        self.product = product
        self.client.force_authenticate(self.buyer)

    def test_checkout_and_cancel(self):
        response = self.client.post('/api/orders/', {
            'items': [{'productId': self.product.pk, 'quantity': 2}],
            'shippingInfo': {'address1': '1 Main Street', 'city': 'Paris'},
            'paymentMethod': 'cash_on_delivery',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('orderNumber', response.data)
        order = Order.objects.get(pk=response.data['id'])
        cancelled = self.client.post(f'/api/orders/{order.pk}/cancel/')
        self.assertEqual(cancelled.status_code, 200)
        self.assertEqual(cancelled.data['status'], 'cancelled')
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 3)

    def test_insufficient_stock_rolls_back_order_and_stock(self):
        response = self.client.post('/api/orders/', {
            'items': [{'productId': self.product.pk, 'quantity': 99}],
            'shippingInfo': {'address1': '1 Main Street', 'city': 'Paris'},
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 5)

    def test_vendor_sees_only_own_orders_and_allowed_status_transitions(self):
        vendor = self.product.vendor.user
        self.client.force_authenticate(vendor)
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 0)
        self.client.force_authenticate(self.buyer)
        order_response = self.client.post('/api/orders/', {
            'items': [{'productId': self.product.pk, 'quantity': 1}],
            'shippingInfo': {'address1': '1 Main Street', 'city': 'Paris'},
        }, format='json')
        self.client.force_authenticate(vendor)
        order_id = order_response.data['id']
        self.assertEqual(self.client.patch(f'/api/orders/{order_id}/',
                                           {'deliveryStatus': 'shipped'}, format='json').status_code, 409)
