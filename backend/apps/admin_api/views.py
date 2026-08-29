from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.response import Response
from apps.users.models import User, VendorProfile, VendorAudit
from apps.products.models import Product, Category
from apps.orders.models import Order
from apps.products.serializers import ProductSerializer, CategorySerializer
from apps.users.serializers import VendorProfileSerializer, UserSerializer
from apps.orders.serializers import OrderSerializer
from apps.commissions.models import Commission
from .serializers import AuditSerializer

class AdminOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_staff or request.user.user_type == 'admin')

class AdminDashboardAPI(generics.GenericAPIView):
    permission_classes = [AdminOnly]
    def get(self, request):
        sales = Order.objects.filter(status__in=['confirmed','processing','shipped','delivered']).aggregate(total=Sum('total'))['total'] or 0
        pending_vendors = VendorProfile.objects.filter(approval_status='pending')
        pending_products = Product.objects.filter(status='pending')
        return Response({'users': User.objects.count(), 'activeVendors': VendorProfile.objects.filter(is_approved=True).count(),
                         'publishedProducts': Product.objects.filter(status='published').count(),
                         'orders': Order.objects.count(), 'revenue': sales,
                         'commissions': Commission.objects.aggregate(total=Sum('amount'))['total'] or 0,
                         'productCount': Product.objects.count(), 'vendorCount': VendorProfile.objects.count(),
                         'userCount': User.objects.count(), 'orderCount': Order.objects.count(), 'sales': sales,
                         'recentOrders': OrderSerializer(Order.objects.order_by('-created_at')[:10], many=True).data,
                         'pendingVendors': VendorProfileSerializer(pending_vendors, many=True).data,
                         'pendingProducts': ProductSerializer(pending_products, many=True).data,
                         'alerts': [], 'queues': {'pendingVendors': pending_vendors.count()}})

class AdminVendorAPI(generics.ListCreateAPIView):
    serializer_class = VendorProfileSerializer
    permission_classes = [AdminOnly]
    queryset = VendorProfile.objects.all()
    def patch(self, request, *args, **kwargs):
        vendor_id = request.data.get('id') or request.query_params.get('id')
        try: vendor = VendorProfile.objects.get(pk=vendor_id)
        except (VendorProfile.DoesNotExist, TypeError, ValueError): return Response({'message':'Vendor not found.'}, status=404)
        new_status = request.data.get('approvalStatus')
        if new_status:
            vendor.approval_status = new_status
            vendor.is_approved = new_status == 'approved'
            vendor.rejection_reason = request.data.get('reason', '')
            if new_status == 'approved': vendor.approved_at = timezone.now()
            vendor.save()
            VendorAudit.objects.create(vendor=vendor, action=new_status, reason=vendor.rejection_reason, performed_by=request.user)
        return Response(VendorProfileSerializer(vendor).data)

class AdminVendorDetailAPI(generics.GenericAPIView):
    permission_classes = [AdminOnly]
    def get(self, request, pk):
        return Response(VendorProfileSerializer(VendorProfile.objects.get(pk=pk)).data)
    def patch(self, request, pk):
        request._request.GET = request._request.GET.copy()
        request._request.GET['id'] = str(pk)
        return AdminVendorAPI().patch(request)

class AdminProductAPI(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AdminOnly]
    queryset = Product.objects.all()
    def patch(self, request, *args, **kwargs):
        product = Product.objects.get(pk=request.data.get('id') or request.query_params.get('id'))
        product.status = {'APPROVED': 'published', 'PENDING': 'pending',
                          'REJECTED': 'rejected', 'HIDDEN': 'hidden'}.get(
                              str(request.data.get('status', product.status)).upper(),
                              request.data.get('status', product.status))
        product.is_published = product.status == 'published'
        product.save(update_fields=['status', 'is_published', 'updated_at'])
        return Response(ProductSerializer(product).data)

class AdminProductDetailAPI(generics.GenericAPIView):
    permission_classes = [AdminOnly]
    def patch(self, request, pk):
        product = Product.objects.get(pk=pk)
        product.status = {'APPROVED': 'published', 'PENDING': 'pending',
                          'REJECTED': 'rejected', 'HIDDEN': 'hidden'}.get(
                              str(request.data.get('status', product.status)).upper(),
                              request.data.get('status', product.status))
        product.is_published = product.status == 'published'
        product.save(update_fields=['status', 'is_published', 'updated_at'])
        return Response(ProductSerializer(product).data)

class AdminOrderAPI(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AdminOnly]
    queryset = Order.objects.all()

class AdminUserAPI(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [AdminOnly]
    queryset = User.objects.all()
    def patch(self, request, *args, **kwargs):
        user = User.objects.get(pk=request.data.get('id') or request.query_params.get('id'))
        if 'isActive' in request.data: user.is_active = request.data['isActive']; user.save(update_fields=['is_active'])
        return Response(UserSerializer(user).data)

class AdminUserDetailAPI(generics.GenericAPIView):
    permission_classes = [AdminOnly]
    def patch(self, request, pk):
        user = User.objects.get(pk=pk)
        if 'isActive' in request.data:
            user.is_active = request.data['isActive']; user.save(update_fields=['is_active'])
        return Response(UserSerializer(user).data)

class AdminCategoryDetailAPI(generics.GenericAPIView):
    permission_classes = [AdminOnly]
    def patch(self, request, pk):
        category = Category.objects.get(pk=pk)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True); serializer.save()
        return Response(serializer.data)
    def delete(self, request, pk):
        Category.objects.filter(pk=pk).delete()
        return Response(status=204)

class AdminAuditAPI(generics.ListAPIView):
    serializer_class = AuditSerializer
    permission_classes = [AdminOnly]
    queryset = VendorAudit.objects.order_by('-created_at')

class AdminCategoryAPI(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AdminOnly]
    queryset = Category.objects.all()
    def perform_create(self, serializer):
        serializer.save(name_key=self.request.data.get('nameKey', self.request.data.get('name', '')))
    def patch(self, request, *args, **kwargs):
        category = Category.objects.get(pk=request.data.get('id') or request.query_params.get('id'))
        serializer = self.get_serializer(category, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True); serializer.save()
        return Response(serializer.data)
    def delete(self, request, *args, **kwargs):
        Category.objects.filter(pk=request.data.get('id') or request.query_params.get('id')).delete()
        return Response(status=204)

class VendorDashboardAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        if request.user.user_type == 'vendor' and (
                not hasattr(request.user, 'vendor_profile')
                or not request.user.vendor_profile.is_approved
                or request.user.vendor_profile.approval_status != 'approved'):
            return Response({'message': 'Vendor approval required.'}, status=403)
        vendor_id = request.query_params.get('vendor')
        if vendor_id and (request.user.is_staff or request.user.user_type == 'admin'):
            vendor = VendorProfile.objects.get(pk=vendor_id)
        elif hasattr(request.user, 'vendor_profile'):
            vendor = request.user.vendor_profile
        else:
            return Response({'message': 'Vendor access required.'}, status=403)
        products = Product.objects.filter(vendor=vendor)
        orders = Order.objects.filter(items__product__vendor=vendor).distinct()
        sales = orders.aggregate(total=Sum('total'))['total'] or 0
        commission_total = Commission.objects.filter(vendor=vendor).aggregate(total=Sum('amount'))['total'] or 0
        return Response({'productCount': products.count(), 'sales': sales, 'orderCount': orders.count(),
                         'conversionRate': 0, 'commissionTotal': commission_total})
