from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from apps.permissions import IsAdminOrManager
from .models import SiteSettings, Entity, Branch, Department, Domain
from .serializers import SiteSettingsSerializer, EntitySerializer, BranchSerializer, DepartmentSerializer, DomainSerializer


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [IsAdminUser]


class EntityViewSet(viewsets.ModelViewSet):
    queryset = Entity.objects.all()
    serializer_class = EntitySerializer
    permission_classes = [IsAdminUser]
    search_fields = ['name']


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.select_related('entity').all()
    serializer_class = BranchSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['entity']


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.select_related('branch').all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrManager]
    filterset_fields = ['branch']


class DomainViewSet(viewsets.ModelViewSet):
    queryset = Domain.objects.select_related('department').all()
    serializer_class = DomainSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['department']
