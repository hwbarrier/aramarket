from django.urls import path
from .views import VendorApplicationAPI, VendorListAPI, VendorDetailAPI
from apps.products.views import VendorPublicProductsAPI
urlpatterns = [
    path('apply/', VendorApplicationAPI.as_view(), name='vendor-apply'),
    path('', VendorListAPI.as_view(), name='vendors'),
    path('<int:pk>/', VendorDetailAPI.as_view(), name='vendor'),
    path('<int:pk>/products/', VendorPublicProductsAPI.as_view(), name='vendor-products'),
]
