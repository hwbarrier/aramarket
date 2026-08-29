from django.contrib import admin
from .models import Category, Product, ProductImage, ProductOption, ProductOptionValue

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductOptionInline(admin.TabularInline):
    model = ProductOption
    extra = 1

class ProductOptionValueInline(admin.TabularInline):
    model = ProductOptionValue
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'vendor', 'category', 'price', 'quantity', 'is_published', 'created_at']
    list_filter = ['is_published', 'is_featured', 'category', 'created_at']
    search_fields = ['name', 'sku', 'vendor__store_name']
    inlines = [ProductImageInline, ProductOptionInline]

@admin.register(ProductOption)
class ProductOptionAdmin(admin.ModelAdmin):
    list_display = ['product', 'name']
    list_filter = ['product__vendor']

@admin.register(ProductOptionValue)
class ProductOptionValueAdmin(admin.ModelAdmin):
    list_display = ['option', 'value', 'price_modifier', 'quantity']
    list_filter = ['option__product__vendor']