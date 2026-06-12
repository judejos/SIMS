from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer
from apps.permissions import IsAdminOrManager


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related('assigned_to', 'assigned_by', 'verified_by', 'project').all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'priority', 'assigned_to', 'assigned_by', 'project', 'task_type']
    search_fields = ['title', 'description', 'assigned_to__username']
    ordering_fields = ['created_at', 'due_date', 'priority', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'intern':
            qs = qs.filter(assigned_to=user)
        elif profile and profile.role == 'mentor':
            qs = qs.filter(assigned_to__intern__mentor=user)
        return qs

    def get_permissions(self):
        if self.action in ('create', 'destroy'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        task = self.get_object()
        task.status = 'verified'
        task.verified_by = request.user
        task.save()
        return Response({'status': 'verified'})
