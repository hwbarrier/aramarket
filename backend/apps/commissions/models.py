from django.conf import settings
from django.db import models
from apps.orders.models import Order
from apps.users.models import VendorProfile

class Commission(models.Model):
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE, related_name='commissions')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='commissions')
    rate = models.DecimalField(max_digits=5, decimal_places=2, default=10)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payout = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
