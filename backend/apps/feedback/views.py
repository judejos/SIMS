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

    def get_queryset(self):
        from django.db.models import Q
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile:
            if profile.role == 'intern':
                qs = qs.filter(given_to=user)
            elif profile.role == 'mentor':
                qs = qs.filter(Q(given_by=user) | Q(given_to__intern__mentor=user))
            elif profile.role in ('lead', 'sme'):
                qs = qs.filter(Q(given_to__profile__department=profile.department) | Q(given_by__profile__department=profile.department))
        return qs
