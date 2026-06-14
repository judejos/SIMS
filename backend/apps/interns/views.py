from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Intern
from .serializers import InternSerializer
from apps.permissions import IsAdminOrManager


class InternViewSet(viewsets.ModelViewSet):
    queryset = Intern.objects.select_related('user', 'mentor', 'approved_by').all()
    serializer_class = InternSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'mentor', 'domain', 'scheme']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'college', 'degree', 'domain']
    ordering_fields = ['start_date', 'end_date', 'status']
    ordering = ['-start_date']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile:
            if profile.role == 'intern':
                qs = qs.filter(user=user)
            elif profile.role == 'mentor':
                qs = qs.filter(mentor=user)
            elif profile.role in ('lead', 'sme'):
                qs = qs.filter(user__profile__department=profile.department)
        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy', 'approve', 'reject'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        intern = self.get_object()
        intern.status = 'active'
        intern.approved_by = request.user
        intern.approved_at = timezone.now()
        intern.save()
        return Response({'status': 'active'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        intern = self.get_object()
        intern.status = 'terminated'
        intern.approved_by = request.user
        intern.approved_at = timezone.now()
        intern.save()
        return Response({'status': 'terminated'})
