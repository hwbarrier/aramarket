from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductOption, ProductOptionValue

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'alt_text', 'is_default')

class ProductOptionValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductOptionValue
        fields = ('id', 'value', 'price_modifier', 'quantity')

class ProductOptionSerializer(serializers.ModelSerializer):
    values = ProductOptionValueSerializer(many=True, read_only=True)
    class Meta:
        model = ProductOption
        fields = ('id', 'name', 'values')

class ProductSerializer(serializers.ModelSerializer):
    vendorId = serializers.IntegerField(source='vendor_id', read_only=True)
    vendorName = serializers.CharField(source='vendor.store_name', read_only=True)
    vendor = serializers.SerializerMethodField(read_only=True)
    categoryId = serializers.IntegerField(source='category_id', required=False, allow_null=True)
    category = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    options = ProductOptionSerializer(many=True, read_only=True)
    originalPrice = serializers.DecimalField(source='compare_price', max_digits=10, decimal_places=2,
                                             required=False, allow_null=True)
    stockQuantity = serializers.IntegerField(source='quantity')
    reviewCount = serializers.IntegerField(source='review_count', read_only=True)
    subCategory = serializers.CharField(source='sub_category', required=False)
    shippingInfo = serializers.JSONField(source='shipping_info', required=False)
    inStock = serializers.SerializerMethodField()
    isOnSale = serializers.SerializerMethodField()
    dateAdded = serializers.DateTimeField(source='created_at', read_only=True)
    dateUpdated = serializers.DateTimeField(source='updated_at', read_only=True)
    isFeatured = serializers.BooleanField(source='is_featured', required=False)

    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'originalPrice', 'image', 'images', 'rating', 'reviewCount',
                  'category', 'categoryId', 'subCategory', 'brand', 'description', 'features',
                  'specifications', 'inStock', 'stockQuantity', 'isOnSale', 'tags', 'vendorId',
                  'vendorName', 'vendor', 'shippingInfo', 'weight', 'sku', 'barcode', 'dateAdded',
                  'dateUpdated', 'isFeatured', 'status', 'options')

    def get_image(self, obj):
        first = obj.images.filter(is_default=True).first() or obj.images.first()
        return first.image.url if first and first.image else None
    def get_vendor(self, obj):
        return {'id': obj.vendor_id, 'name': obj.vendor.user.first_name or obj.vendor.store_name,
                'shopName': obj.vendor.store_name, 'rating': float(obj.vendor.rating),
                'isVerified': obj.vendor.user.is_email_verified}
    def get_inStock(self, obj):
        return obj.quantity > 0 or obj.can_backorder
    def get_isOnSale(self, obj):
        return obj.compare_price is not None and obj.compare_price > obj.price

class CategorySerializer(serializers.ModelSerializer):
    nameKey = serializers.CharField(source='name_key', required=False)
    isActive = serializers.BooleanField(source='is_active', required=False)
    productCount = serializers.IntegerField(source='products.count', read_only=True)
    subCategories = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ('id', 'name', 'nameKey', 'subCategories', 'icon', 'description', 'productCount', 'isActive')
    def get_subCategories(self, obj):
        return []
