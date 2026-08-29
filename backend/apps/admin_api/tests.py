from rest_framework.test import APITestCase

from apps.orders.models import Order
from apps.products.models import Category, Product
from apps.users.models import User, VendorAudit, VendorProfile
from apps.commissions.models import Commission


class AdminAndCommissionContractTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('admin@test.local', 'secret123')
        self.vendor_user = User.objects.create_user('vendor@test.local', 'secret123', user_type='vendor')
        self.vendor = VendorProfile.objects.create(
            user=self.vendor_user, store_name='Test Vendor', is_approved=True, approval_status='approved',
        )
        self.buyer = User.objects.create_user('buyer@test.local', 'secret123')
        product = Product.objects.create(
            vendor=self.vendor, category=Category.objects.create(name='Commission'),
            name='Commission product', description='Test', price=100, quantity=2,
        )
        self.order = Order.objects.create(
            customer=self.buyer, order_number='AM-COMMISSION-TEST', status='delivered',
            subtotal=100, total=100, shipping_address={'city': 'Paris'},
        )
        self.product = product

    def test_commission_totals_are_scoped_and_calculated(self):
        Commission.objects.create(vendor=self.vendor, order=self.order, rate=10, amount=10, payout=90)
        self.client.force_authenticate(self.vendor_user)
        response = self.client.get('/api/commissions/totals/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total'], 10)
        self.assertEqual(response.data['payout'], 90)

    def test_admin_vendor_approval_creates_audit(self):
        pending_user = User.objects.create_user('pending@test.local', 'secret123', user_type='vendor')
        pending = VendorProfile.objects.create(user=pending_user, store_name='Pending')
        self.client.force_authenticate(self.admin)
        response = self.client.patch('/api/admin/vendors/', {
            'id': pending.pk, 'approvalStatus': 'approved',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(VendorAudit.objects.filter(vendor=pending, action='approved').exists())
