from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListAPI.as_view(), name='order-list'),
    path('<int:pk>/cancel/', views.cancel_order, name='order-cancel'),
    path('<int:pk>/', views.OrderDetailAPI.as_view(), name='order-detail'),
    path('payment/', views.PaymentAPI.as_view(), name='payment'),
]