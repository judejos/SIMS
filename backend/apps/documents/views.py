from rest_framework import viewsets, permissions, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Document
from .serializers import DocumentSerializer
from apps.permissions import IsAdminOrManager


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related('uploaded_by', 'reviewed_by').all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    filterset_fields = ['document_type', 'status', 'uploaded_by']
    search_fields = ['title', 'uploaded_by__username']
    ordering_fields = ['uploaded_at', 'title']
    ordering = ['-uploaded_at']

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    def get_permissions(self):
        if self.action == 'destroy':
            from apps.permissions import DenyAdminWrite
            return [IsAdminOrManager(), DenyAdminWrite()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrManager])
    def approve(self, request, pk=None):
        profile = getattr(request.user, 'profile', None)
        if profile and profile.role == 'admin':
            return Response({'detail': 'Admin has view-only access'}, status=403)
        doc = self.get_object()
        doc.status = 'approved'
        doc.reviewed_by = request.user
        doc.reviewed_at = timezone.now()
        doc.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrManager])
    def reject(self, request, pk=None):
        profile = getattr(request.user, 'profile', None)
        if profile and profile.role == 'admin':
            return Response({'detail': 'Admin has view-only access'}, status=403)
        doc = self.get_object()
        doc.status = 'rejected'
        doc.reviewed_by = request.user
        doc.reviewed_at = timezone.now()
        doc.save()
        return Response({'status': 'rejected'})
