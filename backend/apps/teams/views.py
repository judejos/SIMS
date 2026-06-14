from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
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
        if self.action in ('create', 'update', 'partial_update', 'destroy', 'assign_interns', 'remove_intern'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], url_path='assign-interns')
    def assign_interns(self, request, pk=None):
        team = self.get_object()
        user_ids = request.data.get('interns', [])
        if user_ids:
            team.members.add(*user_ids)
        return Response({'status': 'interns assigned'})

    @action(detail=True, methods=['post'], url_path='remove-intern')
    def remove_intern(self, request, pk=None):
        team = self.get_object()
        user_id = request.data.get('intern_id')
        if user_id:
            team.members.remove(user_id)
        return Response({'status': 'intern removed'})

    @action(detail=False, methods=['get'], url_path='available-interns')
    def available_interns(self, request):
        from django.contrib.auth.models import User
        # Interns not in any team
        interns = User.objects.filter(profile__role='intern', teams__isnull=True)
        return Response([{'id': i.id, 'name': i.get_full_name(), 'username': i.username} for i in interns])
