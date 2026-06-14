from rest_framework.permissions import BasePermission

ADMIN_ROLES = ('superadmin', 'admin')
MANAGER_ROLES = ('superadmin', 'admin', 'manager')
STAFF_ROLES = ('superadmin', 'admin', 'manager', 'lead', 'sme', 'mentor')


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
    """Lead, SME, Mentor, Manager, Admin"""
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


class IsAdminOrManagerOrStaff(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        profile = getattr(request.user, 'profile', None)
        return request.user.is_superuser or (profile and profile.role in STAFF_ROLES)

