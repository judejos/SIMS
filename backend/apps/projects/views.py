from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
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
        if self.action in ('create', 'update', 'partial_update', 'destroy', 'assign_team', 'assign_team_lead'):
            from apps.permissions import DenyAdminWrite
            return [IsAdminOrManager(), DenyAdminWrite()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], url_path='assign-team')
    def assign_team(self, request, pk=None):
        project = self.get_object()
        user_ids = request.data.get('members', [])
        if user_ids:
            project.members.add(*user_ids)
        return Response({'status': 'team assigned'})

    @action(detail=True, methods=['post'], url_path='assign-team-lead')
    def assign_team_lead(self, request, pk=None):
        project = self.get_object()
        lead_id = request.data.get('manager')
        if lead_id:
            project.manager_id = lead_id
            project.save()
        return Response({'status': 'lead assigned'})
