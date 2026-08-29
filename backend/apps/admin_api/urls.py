from django.urls import path
from .views import (AdminDashboardAPI, AdminVendorAPI, AdminVendorDetailAPI, AdminProductAPI,
                    AdminProductDetailAPI, AdminOrderAPI, AdminUserAPI, AdminUserDetailAPI,
                    AdminAuditAPI, AdminCategoryAPI, AdminCategoryDetailAPI)
urlpatterns = [
    path('dashboard/', AdminDashboardAPI.as_view()),
    path('vendors/', AdminVendorAPI.as_view()),
    path('vendors/<int:pk>/', AdminVendorDetailAPI.as_view()),
    path('products/', AdminProductAPI.as_view()),
    path('products/<int:pk>/', AdminProductDetailAPI.as_view()),
    path('orders/', AdminOrderAPI.as_view()),
    path('users/', AdminUserAPI.as_view()),
    path('users/<int:pk>/', AdminUserDetailAPI.as_view()),
    path('vendor-audits/', AdminAuditAPI.as_view()),
    path('categories/', AdminCategoryAPI.as_view()),
    path('categories/<int:pk>/', AdminCategoryDetailAPI.as_view()),
]
