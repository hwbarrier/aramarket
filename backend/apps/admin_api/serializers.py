from rest_framework import serializers
from apps.users.models import User, VendorProfile, VendorAudit
from apps.products.models import Product, Category
from apps.orders.models import Order
from apps.products.serializers import ProductSerializer, CategorySerializer
from apps.users.serializers import VendorProfileSerializer, UserSerializer
from apps.orders.serializers import OrderSerializer

class VendorAdminSerializer(VendorProfileSerializer):
    approvalStatus = serializers.CharField(source='approval_status', required=False)
    class Meta(VendorProfileSerializer.Meta):
        fields = VendorProfileSerializer.Meta.fields + ('is_approved',)

class ProductAdminSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields

class AuditSerializer(serializers.ModelSerializer):
    vendorId = serializers.IntegerField(source='vendor_id')
    vendorName = serializers.CharField(source='vendor.store_name', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at')
    class Meta:
        model = VendorAudit
        fields = ('id', 'vendorId', 'vendorName', 'action', 'reason', 'createdAt', 'performed_by')
