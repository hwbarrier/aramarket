from rest_framework.test import APITestCase
from apps.users.models import User, VendorProfile
from .models import Category, Product

class ProductContractTests(APITestCase):
    def setUp(self):
        user = User.objects.create_user('vendor-test@example.com', 'secret123', user_type='vendor',
                                        first_name='Vendor')
        vendor = VendorProfile.objects.create(user=user, store_name='Test Shop',
                                              is_approved=True, approval_status='approved')
        self.category = Category.objects.create(name='Test category')
        self.product = Product.objects.create(vendor=vendor, category=self.category, name='Test product',
                                               description='A product', price=10, quantity=4,
                                               is_published=True, status='published')

    def test_public_listing_supports_contract_filters_and_camel_case(self):
        response = self.client.get('/api/products/?query=Test&limit=5&sortBy=price_low')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['stockQuantity'], 4)
        self.assertIn('vendorId', response.data['results'][0])

    def test_vendor_products_are_scoped(self):
        other = User.objects.create_user('other-vendor@example.com', 'secret123', user_type='vendor')
        self.client.force_authenticate(other)
        response = self.client.patch(f'/api/products/{self.product.pk}/', {'stockQuantity': 1}, format='json')
        self.assertEqual(response.status_code, 403)
