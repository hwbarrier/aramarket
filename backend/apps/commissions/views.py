from django.db.models import Sum
from decimal import Decimal, InvalidOperation
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Commission
from apps.users.models import VendorProfile
from apps.orders.models import Order
from .serializers import CommissionSerializer
class CommissionListAPI(generics.ListCreateAPIView):
    serializer_class = CommissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        queryset = Commission.objects.all() if user.is_staff or user.user_type == 'admin' else Commission.objects.filter(vendor__user=user)
        vendor = self.request.query_params.get('vendor')
        if vendor: queryset = queryset.filter(vendor_id=vendor)
        return queryset
    def create(self, request, *args, **kwargs):
        try:
            vendor = VendorProfile.objects.get(pk=request.data['vendorId'])
            order = Order.objects.get(pk=request.data['orderId'])
            rate = Decimal(str(request.data.get('rate', 10)))
            total = Decimal(str(request.data.get('orderTotal', request.data.get('total', 0))))
            commission = Commission.objects.create(vendor=vendor, order=order, rate=rate,
                                                   amount=total * rate / 100, payout=total * (100 - rate) / 100)
        except (KeyError, ValueError, TypeError, InvalidOperation, VendorProfile.DoesNotExist, Order.DoesNotExist):
            return Response({'message': 'Invalid commission payload.'}, status=400)
        return Response(self.get_serializer(commission).data, status=201)
class CommissionTotalsAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        queryset = Commission.objects.all() if request.user.is_staff or request.user.user_type == 'admin' else Commission.objects.filter(vendor__user=request.user)
        vendor = request.query_params.get('vendor')
        if vendor: queryset = queryset.filter(vendor_id=vendor)
        totals = queryset.aggregate(total=Sum('amount'), payout=Sum('payout'))
        return Response({'total': totals['total'] or 0, 'payout': totals['payout'] or 0})
