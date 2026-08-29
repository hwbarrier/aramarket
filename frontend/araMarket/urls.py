from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from apps.products.views import CategoryListAPI

def home(request):
    return JsonResponse({
        'message': 'AraMarket API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api_auth': '/api/auth/',
            'api_products': '/api/products/',
            'api_orders': '/api/orders/',
            'api_cart': '/api/cart/',
        }
    })

urlpatterns = [
    path('', home),  # Ajoutez cette ligne
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/vendors/', include('apps.users.public_urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/categories/', CategoryListAPI.as_view()),
    path('api/orders/', include('apps.orders.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/commissions/', include('apps.commissions.urls')),
    path('api/admin/', include('apps.admin_api.urls')),
    path('api/vendor/', include('apps.admin_api.vendor_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
