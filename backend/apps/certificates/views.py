from rest_framework import viewsets, permissions
from .models import Certificate
from .serializers import CertificateSerializer
from apps.permissions import IsAdminOrManager


class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.select_related('intern', 'issued_by').all()
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['intern', 'issued_by']
    search_fields = ['title', 'intern__username']
    ordering_fields = ['issued_date']
    ordering = ['-issued_date']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'intern':
            qs = qs.filter(intern=user)
        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]
