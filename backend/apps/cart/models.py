from django.db import models
from apps.users.models import User
from apps.products.models import Product, ProductOptionValue

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Cart of {self.user.email}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')  # ⬅️ CHAMP MANQUANT
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    variant = models.ForeignKey('products.ProductOptionValue', on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1)  # ⬅️ CHAMP MANQUANT
    added_at = models.DateTimeField(auto_now_add=True)  # ⬅️ CHAMP MANQUANT
    
    class Meta:
        unique_together = ['cart', 'product', 'variant']  # ⬅️ META MANQUANT
    
    def __str__(self):
        return f"{self.product.name} in {self.cart.user.email}'s cart"