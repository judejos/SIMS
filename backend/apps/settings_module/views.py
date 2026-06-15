from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAdminUser
from apps.permissions import IsAdminOrManager, DenyAdminWrite
from .models import SiteSettings, Entity, Branch, Department, Domain
from .serializers import SiteSettingsSerializer, EntitySerializer, BranchSerializer, DepartmentSerializer, DomainSerializer


class AdminViewOnlyMixin:
    """Admin can read but not write. Superadmin and manager can do both."""
    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminOrManager(), DenyAdminWrite()]
        return [permissions.IsAuthenticated()]


class SiteSettingsViewSet(AdminViewOnlyMixin, viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer


class EntityViewSet(AdminViewOnlyMixin, viewsets.ModelViewSet):
    queryset = Entity.objects.all()
    serializer_class = EntitySerializer
    search_fields = ['name']


class BranchViewSet(AdminViewOnlyMixin, viewsets.ModelViewSet):
    queryset = Branch.objects.select_related('entity').all()
    serializer_class = BranchSerializer
    filterset_fields = ['entity']


class DepartmentViewSet(AdminViewOnlyMixin, viewsets.ModelViewSet):
    queryset = Department.objects.select_related('branch').all()
    serializer_class = DepartmentSerializer
    filterset_fields = ['branch']


class DomainViewSet(AdminViewOnlyMixin, viewsets.ModelViewSet):
    queryset = Domain.objects.select_related('department').all()
    serializer_class = DomainSerializer
    filterset_fields = ['department']
