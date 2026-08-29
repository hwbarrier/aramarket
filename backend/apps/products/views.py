import json
from django.db.models import Q
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

def is_admin(user):
    return user.is_authenticated and (user.is_staff or user.user_type == 'admin')

class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 100

class CategoryListAPI(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductListAPI(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'vendor', 'is_featured']
    search_fields = ['name', 'description', 'brand', 'tags']
    ordering_fields = ['price', 'rating', 'created_at', 'name']
    permission_classes = [permissions.AllowAny]
    pagination_class = ProductPagination
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    def get_queryset(self):
        queryset = Product.objects.select_related('vendor__user', 'category').prefetch_related('images')
        if not is_admin(self.request.user) and self.request.method == 'GET':
            queryset = queryset.filter(is_published=True, status='published')
        query = self.request.query_params.get('query')
        if query:
            queryset = queryset.filter(Q(name__icontains=query) | Q(description__icontains=query))
        raw_filters = self.request.query_params.get('filters')
        if raw_filters:
            try:
                filter_data = json.loads(raw_filters)
                price_range = filter_data.get('priceRange', {})
                if price_range.get('min') is not None: queryset = queryset.filter(price__gte=price_range['min'])
                if price_range.get('max') is not None: queryset = queryset.filter(price__lte=price_range['max'])
                if filter_data.get('inStock'): queryset = queryset.filter(quantity__gt=0)
                if filter_data.get('category'): queryset = queryset.filter(category_id=filter_data['category'])
                if filter_data.get('vendorId'): queryset = queryset.filter(vendor_id=filter_data['vendorId'])
            except (TypeError, ValueError):
                pass
        sort = self.request.query_params.get('sortBy')
        ordering = {'price_low': 'price', 'price-low': 'price', 'price_high': '-price',
                    'price-high': '-price', 'rating': '-rating',
                    'newest': '-created_at', 'name': 'name'}.get(sort)
        return queryset.order_by(ordering or '-created_at')
    def perform_create(self, serializer):
        user = self.request.user
        if (user.user_type != 'vendor' or not hasattr(user, 'vendor_profile')
                or not user.vendor_profile.is_approved
                or user.vendor_profile.approval_status != 'approved'):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only approved vendors can manage products.')
        serializer.save(vendor=user.vendor_profile)

class ProductDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    def get_permissions(self):
        return [permissions.AllowAny()] if self.request.method == 'GET' else [permissions.IsAuthenticated()]
    def get_queryset(self):
        queryset = Product.objects.select_related('vendor__user', 'category').prefetch_related('images')
        if is_admin(self.request.user):
            return queryset
        published = Q(is_published=True, status='published')
        if self.request.user.is_authenticated:
            return queryset.filter(published | Q(vendor__user=self.request.user))
        return queryset.filter(published)
    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method != 'GET' and not is_admin(request.user) and obj.vendor.user != request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You do not own this product.')

class VendorProductListAPI(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    from apps.users.permissions import IsApprovedVendor
    permission_classes = [IsApprovedVendor]
    def get_queryset(self):
        return Product.objects.filter(vendor__user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user.vendor_profile)

class VendorProductDetailAPI(ProductDetailAPI):
    from apps.users.permissions import IsApprovedVendor
    permission_classes = [IsApprovedVendor]
    def get_queryset(self):
        return Product.objects.filter(vendor__user=self.request.user)

class VendorPublicProductsAPI(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        return Product.objects.filter(vendor_id=self.kwargs['pk'], is_published=True, status='published')
