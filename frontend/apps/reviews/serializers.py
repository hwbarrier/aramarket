from rest_framework import serializers
from apps.orders.models import OrderItem
from apps.products.models import Product
from apps.users.models import VendorProfile
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    targetType = serializers.CharField(source='target_type')
    targetId = serializers.IntegerField(source='target_id')
    authorId = serializers.IntegerField(source='author_id', read_only=True)
    authorName = serializers.CharField(source='author_name', required=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'targetType', 'targetId', 'authorId', 'authorName', 'rating', 'comment', 'createdAt')
        read_only_fields = ('id', 'authorId', 'createdAt')

    def validate_target_type(self, value):
        if value not in ('product', 'vendor'):
            raise serializers.ValidationError('targetType must be product or vendor.')
        return value

    def validate(self, attrs):
        request = self.context['request']
        target_type = attrs.get('target_type')
        target_id = attrs.get('target_id')
        if target_type == 'product':
            if not Product.objects.filter(pk=target_id).exists():
                raise serializers.ValidationError({'targetId': 'Product does not exist.'})
            eligible = OrderItem.objects.filter(
                order__customer=request.user, product_id=target_id, order__status='delivered',
            ).exists()
        else:
            if not VendorProfile.objects.filter(pk=target_id).exists():
                raise serializers.ValidationError({'targetId': 'Vendor does not exist.'})
            eligible = OrderItem.objects.filter(
                order__customer=request.user, product__vendor_id=target_id, order__status='delivered',
            ).exists()
        if not eligible:
            raise serializers.ValidationError({'targetId': 'You can only review items from delivered orders.'})
        return attrs

    def create(self, data):
        request = self.context['request']
        data['author'] = request.user
        data.setdefault('author_name', request.user.get_full_name() or request.user.email)
        return super().create(data)
