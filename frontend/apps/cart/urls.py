from django.urls import path
from . import views

urlpatterns = [
    path('', views.CartAPI.as_view(), name='cart-detail'),
    path('items/', views.CartItemCreateAPI.as_view(), name='cart-item-create'),
    path('items/<int:pk>/', views.CartItemUpdateAPI.as_view(), name='cart-item-update'),
    path('items/<int:pk>/delete/', views.CartItemDeleteAPI.as_view(), name='cart-item-delete'),
    path('clear/', views.clear_cart, name='clear-cart'),
]