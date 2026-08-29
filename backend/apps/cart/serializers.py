from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = CartItem
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = '__all__'
    
    def get_total_items(self, obj):
        return obj.items.count()
    
    def get_total_price(self, obj):
        total = 0
        for item in obj.items.all():
            total += item.product.price * item.quantity
        return total