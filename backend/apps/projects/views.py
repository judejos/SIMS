from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer
from apps.permissions import IsAdminOrManager


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.prefetch_related('members').select_related('manager').all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'manager']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'start_date', 'status']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]
