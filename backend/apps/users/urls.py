from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.csrf_cookie, name='csrf'),
    path('register/', views.RegisterAPI.as_view(), name='register'),
    path('login/', views.LoginAPI.as_view(), name='login'),
    path('supabase/', views.SupabaseLoginAPI.as_view(), name='supabase-login'),
    path('logout/', views.LogoutAPI.as_view(), name='logout'),
    path('refresh/', views.RefreshAPI.as_view(), name='refresh'),
    path('me/', views.UserAPI.as_view(), name='me'),
    path('user/', views.UserAPI.as_view(), name='user'),
    path('vendors/', views.VendorListAPI.as_view(), name='vendor-list'),
    path('vendors/<int:pk>/', views.VendorDetailAPI.as_view(), name='vendor-detail'),
]