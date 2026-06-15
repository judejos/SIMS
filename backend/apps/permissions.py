from rest_framework.permissions import BasePermission

ADMIN_ROLES = ('superadmin', 'admin')
MANAGER_ROLES = ('superadmin', 'admin', 'manager')
STAFF_ROLES = ('superadmin', 'admin', 'manager', 'lead', 'mentor')

# Roles that can perform write operations (admin excluded — view-only)
WRITE_ROLES = ('superadmin', 'manager', 'lead', 'mentor')


class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        profile = getattr(request.user, 'profile', None)
        return request.user.is_staff or (profile and profile.role in MANAGER_ROLES)


class IsAdminOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        profile = getattr(request.user, 'profile', None)
        return request.user.is_superuser or (profile and profile.role in ADMIN_ROLES)


class IsStaffOrAbove(BasePermission):
    """Lead, Mentor, Manager, Admin"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        profile = getattr(request.user, 'profile', None)
        return profile and profile.role in STAFF_ROLES


class IsMentor(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        profile = getattr(request.user, 'profile', None)
        return profile and profile.role in STAFF_ROLES


class IsOwnerOrAdminOrManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        profile = getattr(request.user, 'profile', None)
        if profile and profile.role in MANAGER_ROLES:
            return True
        user_field = getattr(obj, 'user', None) or getattr(obj, 'employee', None) or getattr(obj, 'intern', None)
        return user_field == request.user


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in ('GET', 'HEAD', 'OPTIONS')


class DenyAdminWrite(BasePermission):
    """
    Admin role gets view-only access.
    Returns False for write methods (POST/PUT/PATCH/DELETE) when user is admin.
    superadmin is NOT restricted.
    """
    def has_permission(self, request, view):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        if not request.user.is_authenticated:
            return True  # Let other permission classes handle auth
        profile = getattr(request.user, 'profile', None)
        if profile and profile.role == 'admin':
            return False  # Block admin write
        return True  # Allow everyone else


class IsAdminOrManagerOrStaff(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        profile = getattr(request.user, 'profile', None)
        return request.user.is_superuser or (profile and profile.role in STAFF_ROLES)

