from django.db import models
from apps.users.models import User, VendorProfile

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    name_key = models.CharField(max_length=150, blank=True)
    icon = models.CharField(max_length=80, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ('name',)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cost_per_item = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sku = models.CharField(max_length=100, unique=True, null=True, blank=True)
    barcode = models.CharField(max_length=100, null=True, blank=True)
    quantity = models.IntegerField(default=0)
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    can_backorder = models.BooleanField(default=False)
    requires_shipping = models.BooleanField(default=True)
    weight = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    review_count = models.IntegerField(default=0)
    brand = models.CharField(max_length=100, blank=True)
    sub_category = models.CharField(max_length=100, blank=True)
    features = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(default=dict, blank=True)
    tags = models.JSONField(default=list, blank=True)
    shipping_info = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, default='published')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.product.name}"

class ProductOption(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='options')
    name = models.CharField(max_length=100)  # e.g., "Color", "Size"
    
    def __str__(self):
        return f"{self.product.name} - {self.name}"

class ProductOptionValue(models.Model):
    option = models.ForeignKey(ProductOption, on_delete=models.CASCADE, related_name='values')
    value = models.CharField(max_length=100)  # e.g., "Red", "Large"
    price_modifier = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    quantity = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.option.name}: {self.value}"

class CustomCategoryRequest(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='category_requests')
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE, related_name='category_requests')
    requested_category = models.CharField(max_length=150)
    requested_sub_category = models.CharField(max_length=150, blank=True)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    admin_notes = models.TextField(blank=True)