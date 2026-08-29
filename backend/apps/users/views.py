from django.conf import settings
from django.db.models import Count
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from .authentication import authenticate_supabase_user, issue_access, issue_refresh, rotate_refresh, revoke_refresh
from .models import User, VendorProfile
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, VendorProfileSerializer

def auth_response(user, response_status=status.HTTP_200_OK):
    response = Response({'data': UserSerializer(user).data, 'access': issue_access(user)},
                        status=response_status)
    response.set_cookie(settings.JWT_REFRESH_COOKIE, issue_refresh(user), httponly=True,
                        secure=not settings.DEBUG, samesite='Lax',
                        max_age=settings.JWT_REFRESH_DAYS * 86400, path='/api/auth/')
    return response

@api_view(['GET'])
@ensure_csrf_cookie
def csrf_cookie(request):
    return Response({'message': 'CSRF cookie set.'})

class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return auth_response(serializer.save(), status.HTTP_201_CREATED)

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return auth_response(serializer.validated_data['user'])

class LogoutAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        revoke_refresh(request.COOKIES.get(settings.JWT_REFRESH_COOKIE, ''))
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(settings.JWT_REFRESH_COOKIE, path='/api/auth/')
        return response

class RefreshAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE)
        if not token:
            return Response({'message': 'Refresh cookie is required.'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user, new_refresh = rotate_refresh(token)
        except (ValueError, KeyError, IndexError):
            return Response({'message': 'Invalid or expired refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)
        response = Response({'access': issue_access(user)})
        response.set_cookie(settings.JWT_REFRESH_COOKIE, new_refresh, httponly=True,
                            secure=not settings.DEBUG, samesite='Lax',
                            max_age=settings.JWT_REFRESH_DAYS * 86400, path='/api/auth/')
        return response

class SupabaseLoginAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get('access_token') or request.data.get('token')
        if not token:
            return Response({'message': 'Supabase access_token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user, _ = authenticate_supabase_user(token)
        except Exception:
            return Response({'message': 'Invalid Supabase access token.'}, status=status.HTTP_401_UNAUTHORIZED)

        return auth_response(user, status.HTTP_200_OK)


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user

class VendorApplicationAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if request.user.user_type == 'vendor' and hasattr(request.user, 'vendor_profile'):
            return Response({
                'message': 'Vendor application already exists.',
                'data': VendorProfileSerializer(request.user.vendor_profile).data,
            }, status=status.HTTP_200_OK)

        store_name = (request.data.get('storeName') or request.data.get('shopName') or request.data.get('store_name') or f"{request.user.first_name or 'Demo'}'s Shop").strip()
        store_description = (request.data.get('description') or request.data.get('storeDescription') or '').strip()

        if not store_name:
            return Response({'message': 'Store name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        profile = VendorProfile.objects.create(
            user=request.user,
            store_name=store_name,
            store_description=store_description,
            approval_status='pending',
            is_approved=False,
        )
        request.user.user_type = 'vendor'
        request.user.save(update_fields=['user_type'])

        return Response({
            'message': 'Vendor application submitted and is pending approval.',
            'data': VendorProfileSerializer(profile).data,
        }, status=status.HTTP_201_CREATED)


class VendorListAPI(generics.ListAPIView):
    serializer_class = VendorProfileSerializer
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        return VendorProfile.objects.filter(Q(approval_status='approved') | Q(is_approved=True)).annotate(product_count=Count('products'))

class VendorDetailAPI(generics.RetrieveAPIView):
    serializer_class = VendorProfileSerializer
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        return VendorProfile.objects.filter(Q(approval_status='approved') | Q(is_approved=True))
