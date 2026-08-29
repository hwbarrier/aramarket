from django.db.models import Q, Sum, F
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Order, Payment
from .serializers import OrderSerializer, PaymentSerializer
from apps.users.permissions import IsApprovedVendor

def admin_user(user):
    return user.is_authenticated and (user.is_staff or user.user_type == 'admin')

def order_queryset(request):
    user = request.user
    if admin_user(user):
        queryset = Order.objects.all()
    elif user.user_type == 'vendor' and hasattr(user, 'vendor_profile'):
        queryset = Order.objects.filter(items__product__vendor=user.vendor_profile).distinct()
    else:
        queryset = Order.objects.filter(customer=user)
    vendor = request.query_params.get('vendor')
    if vendor and (admin_user(user) or user.user_type == 'vendor'):
        queryset = queryset.filter(items__product__vendor_id=vendor).distinct()
    return queryset.prefetch_related('items__product')

class OrderListAPI(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    def check_permissions(self, request):
        super().check_permissions(request)
        if request.user.user_type == 'vendor' and not IsApprovedVendor().has_permission(request, self):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Vendor approval required.')
    def get_queryset(self):
        return order_queryset(self.request)
    def perform_create(self, serializer):
        serializer.save()

class OrderDetailAPI(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    def check_permissions(self, request):
        super().check_permissions(request)
        if request.user.user_type == 'vendor' and not IsApprovedVendor().has_permission(request, self):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Vendor approval required.')
    def get_queryset(self):
        return order_queryset(self.request)
    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        user = request.user
        allowed = admin_user(user) or obj.customer_id == user.id
        if user.user_type == 'vendor' and hasattr(user, 'vendor_profile'):
            allowed = obj.items.filter(product__vendor=user.vendor_profile).exists()
        if not allowed:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You cannot access this order.')
    def update(self, request, *args, **kwargs):
        if request.user.user_type == 'customer' and any(k in request.data for k in ('status', 'carrier', 'trackingNumber')):
            return Response({'message': 'Customers cannot update order status.'}, status=status.HTTP_403_FORBIDDEN)
        if request.user.user_type == 'vendor':
            current = self.get_object().status
            requested = request.data.get('status', request.data.get('deliveryStatus', current))
            allowed = {
                'pending': {'confirmed', 'cancelled'},
                'confirmed': {'processing', 'cancelled'},
                'processing': {'shipped'},
                'shipped': {'out_for_delivery', 'delivered'},
                'out_for_delivery': {'delivered'},
            }
            if requested != current and requested not in allowed.get(current, set()):
                return Response({'message': 'Invalid order status transition.'}, status=status.HTTP_409_CONFLICT)
        return super().update(request, *args, **kwargs)

@api_view(['POST'])
def cancel_order(request, pk):
    if not request.user.is_authenticated:
        return Response({'message': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'message': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
    if order.customer_id != request.user.id and not admin_user(request.user):
        return Response({'message': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
    if order.status in ('shipped', 'delivered', 'cancelled'):
        return Response({'message': 'Order cannot be cancelled.'}, status=status.HTTP_409_CONFLICT)
    order.status = 'cancelled'
    order.save(update_fields=['status', 'updated_at'])
    return Response(OrderSerializer(order).data)

class PaymentAPI(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
