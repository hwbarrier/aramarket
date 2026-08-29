from django.contrib import admin
from .models import Cart, CartItem

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1
    # Retire le fk_name si ce n'est pas nécessaire
    fields = ['product', 'variant', 'quantity', 'added_at']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at', 'total_items']
    list_filter = ['created_at', 'updated_at']
    inlines = [CartItemInline]
    
    def total_items(self, obj):
        return obj.items.count()
    total_items.short_description = 'Total Items'

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart_user', 'product', 'quantity', 'added_at']
    list_filter = ['added_at', 'cart__user']
    search_fields = ['product__name', 'cart__user__email']
    
    def cart_user(self, obj):
        return obj.cart.user.email
    cart_user.short_description = 'User'