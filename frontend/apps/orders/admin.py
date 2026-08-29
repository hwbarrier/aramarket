from django.contrib import admin
from .models import Order, OrderItem, Payment

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    fields = ['product', 'variant', 'quantity', 'price', 'total']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer', 'status', 'payment_status', 'total', 'created_at']
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'customer__email']
    inlines = [OrderItemInline]

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['order', 'method', 'amount', 'status', 'created_at']
    list_filter = ['method', 'status', 'created_at']
    search_fields = ['order__order_number', 'transaction_id']