from rest_framework import viewsets, permissions
from .models import Asset
from .serializers import AssetSerializer
from apps.permissions import IsAdminOrManager


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.select_related('assigned_to').all()
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'assigned_to']
    search_fields = ['asset_name', 'asset_id']
    ordering_fields = ['purchase_date', 'status', 'asset_name']
    ordering = ['asset_name']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile:
            if profile.role == 'intern':
                qs = qs.filter(assigned_to=user)
            elif profile.role == 'mentor':
                qs = qs.filter(assigned_to__intern__mentor=user)
            elif profile.role in ('lead', 'sme'):
                qs = qs.filter(assigned_to__profile__department=profile.department)
        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            from apps.permissions import IsAdminOrManagerOrStaff
            return [IsAdminOrManagerOrStaff()]
        return [permissions.IsAuthenticated()]
