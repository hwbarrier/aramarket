from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        # Pour Order
        if hasattr(obj, 'customer'):
            return obj.customer == request.user
        # Pour Cart
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # Pour Product (vendor)
        if hasattr(obj, 'vendor'):
            return obj.vendor.user == request.user
        return False

class IsVendorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.user_type == 'vendor'

class IsVendorOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.vendor.user == request.user