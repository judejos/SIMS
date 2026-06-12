from rest_framework import viewsets, permissions
from .models import Team
from .serializers import TeamSerializer
from apps.permissions import IsAdminOrManager


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.prefetch_related('members').select_related('lead').all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['lead']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['name']

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]
