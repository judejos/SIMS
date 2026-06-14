from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
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

    @action(detail=False, methods=['get'], url_path='metrics/(?P<user_id>\d+)')
    def metrics(self, request, user_id=None):
        from apps.tasks.models import Task
        from apps.attendance.models import Attendance
        
        # Calculate task completion rate
        total_tasks = Task.objects.filter(assigned_to_id=user_id).count()
        completed_tasks = Task.objects.filter(assigned_to_id=user_id, status='completed').count()
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Calculate attendance percentage
        total_days = Attendance.objects.filter(user_id=user_id).count()
        present_days = Attendance.objects.filter(user_id=user_id, status='present').count()
        attendance_rate = (present_days / total_days * 100) if total_days > 0 else 0
        
        # Average feedback rating
        feedbacks = Feedback.objects.filter(given_to_id=user_id)
        avg_rating = sum(f.rating for f in feedbacks) / feedbacks.count() if feedbacks.exists() else 0
        
        return Response({
            'task_completion_rate': round(completion_rate, 2),
            'attendance_rate': round(attendance_rate, 2),
            'average_rating': round(avg_rating, 2),
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
        })
