from decimal import Decimal
import uuid
from django.db import transaction
from rest_framework import serializers
from .models import Order, OrderItem, Payment
from apps.products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    productId = serializers.IntegerField(source='product_id')
    productName = serializers.CharField(source='product.name', read_only=True)
    productImage = serializers.SerializerMethodField()
    vendorId = serializers.IntegerField(source='product.vendor_id', read_only=True)
    vendorName = serializers.CharField(source='product.vendor.store_name', read_only=True)
    class Meta:
        model = OrderItem
        fields = ('id', 'productId', 'productName', 'productImage', 'price', 'quantity', 'total',
                  'vendorId', 'vendorName', 'variant')
        read_only_fields = ('id', 'price', 'total')
    def get_productImage(self, obj):
        image = obj.product.images.first()
        return image.image.url if image and image.image else None

class OrderSerializer(serializers.ModelSerializer):
    orderNumber = serializers.CharField(source='order_number', read_only=True)
    userId = serializers.IntegerField(source='customer_id', read_only=True)
    items = OrderItemSerializer(many=True, required=False)
    shipping = serializers.DecimalField(source='shipping_cost', max_digits=10, decimal_places=2, required=False)
    paymentStatus = serializers.CharField(source='payment_status', required=False)
    paymentMethod = serializers.CharField(source='payment_method', required=False)
    shippingInfo = serializers.JSONField(source='shipping_address', required=False)
    orderDate = serializers.DateTimeField(source='created_at', read_only=True)
    notes = serializers.CharField(source='note', required=False, allow_blank=True, allow_null=True)
    estimatedDeliveryDate = serializers.DateTimeField(source='estimated_delivery_date', required=False, allow_null=True)
    trackingNumber = serializers.CharField(source='tracking_number', required=False, allow_blank=True)
    deliveryStatus = serializers.CharField(source='status', required=False)
    shippedAt = serializers.DateTimeField(source='shipped_at', read_only=True)
    deliveredAt = serializers.DateTimeField(source='delivered_at', read_only=True)
    class Meta:
        model = Order
        fields = ('id', 'userId', 'orderNumber', 'items', 'subtotal', 'tax', 'shipping', 'discount',
                  'total', 'currency', 'status', 'paymentStatus', 'paymentMethod', 'shippingInfo',
                  'orderDate', 'estimatedDeliveryDate', 'notes', 'trackingNumber', 'carrier',
                  'shippedAt', 'deliveredAt', 'deliveryStatus')
        read_only_fields = ('id', 'userId', 'orderNumber', 'subtotal', 'total', 'orderDate')

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop('items', [])
        if not items:
            raise serializers.ValidationError({'items': 'At least one item is required.'})
        user = self.context['request'].user
        subtotal = Decimal('0')
        order = Order.objects.create(customer=user, order_number=f'AM-{uuid.uuid4().hex[:12].upper()}',
                                     subtotal=0, total=0, **validated_data)
        for item_data in items:
            product = Product.objects.select_for_update().get(pk=item_data['product_id'])
            quantity = item_data['quantity']
            if quantity < 1 or (product.quantity < quantity and not product.can_backorder):
                raise serializers.ValidationError({'items': f'{product.name} is unavailable.'})
            price = product.price
            line_total = price * quantity
            subtotal += line_total
            OrderItem.objects.create(order=order, product=product, quantity=quantity, price=price,
                                     total=line_total, variant_id=item_data.get('variant_id'))
            if not product.can_backorder:
                product.quantity -= quantity
                product.save(update_fields=['quantity'])
        order.subtotal = subtotal
        order.total = subtotal + Decimal(str(order.tax)) + Decimal(str(order.shipping_cost)) - Decimal(str(order.discount))
        order.save(update_fields=['subtotal', 'total'])
        return order

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'order', 'method', 'amount', 'transaction_id', 'status', 'created_at')
        read_only_fields = ('id', 'created_at')
