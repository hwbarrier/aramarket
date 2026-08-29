from django.urls import path
from .views import VendorDashboardAPI
urlpatterns = [path('dashboard/', VendorDashboardAPI.as_view())]
