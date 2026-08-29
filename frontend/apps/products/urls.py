from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListAPI.as_view(), name='category-list'),
    path('', views.ProductListAPI.as_view(), name='product-list'),
    path('<int:pk>/', views.ProductDetailAPI.as_view(), name='product-detail'),
    path('vendor/products/', views.VendorProductListAPI.as_view(), name='vendor-product-list'),
    path('vendor/products/<int:pk>/', views.VendorProductDetailAPI.as_view(), name='vendor-product-detail'),
]