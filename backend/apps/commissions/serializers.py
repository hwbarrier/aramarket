from rest_framework import serializers
from .models import Commission
class CommissionSerializer(serializers.ModelSerializer):
    vendorId = serializers.IntegerField(source='vendor_id')
    orderId = serializers.IntegerField(source='order_id')
    commissionRate = serializers.DecimalField(source='rate', max_digits=5, decimal_places=2)
    commissionAmount = serializers.DecimalField(source='amount', max_digits=12, decimal_places=2)
    vendorPayout = serializers.DecimalField(source='payout', max_digits=12, decimal_places=2)
    createdAt = serializers.DateTimeField(source='created_at')
    class Meta:
        model = Commission
        fields = ('id', 'vendorId', 'orderId', 'commissionRate', 'commissionAmount', 'vendorPayout',
                  'status', 'createdAt')
