from rest_framework.permissions import BasePermission

ADMIN_ROLES = ('super_admin', 'admin')
MANAGER_ROLES = ('super_admin', 'admin', 'manager')
STAFF_ROLES = ('super_admin', 'admin', 'manager', 'lead', 'sme', 'mentor', 'staff')


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        profile = getattr(request.user, 'profile', None)
        return request.user.is_superuser or (profile and profile.role == 'super_admin')


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
    """Lead, SME, Mentor, Staff, Manager, Admin, Super Admin"""
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
        return profile and profile.role in ('mentor', 'lead', 'manager', 'admin', 'super_admin')


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
        return request.user.is_superuser or (profile and profile.role in ('super_admin', 'admin', 'manager', 'staff'))

