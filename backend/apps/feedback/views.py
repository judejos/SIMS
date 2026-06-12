from rest_framework import viewsets, permissions
from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.select_related('given_by', 'given_to').all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['given_by', 'given_to', 'rating']
    search_fields = ['given_by__username', 'given_to__username', 'comments']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']
