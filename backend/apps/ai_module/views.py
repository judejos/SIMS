from rest_framework.views import APIView
from rest_framework.response import Response
from apps.attendance.models import Attendance
from apps.tasks.models import Task
from django.contrib.auth.models import User


class InternInsightView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        attendance_count = Attendance.objects.filter(user=user, status='present').count()
        completed_tasks = Task.objects.filter(assigned_to=user, status='completed').count()
        total_tasks = Task.objects.filter(assigned_to=user).count()

        score = 0
        if total_tasks > 0:
            score = round((completed_tasks / total_tasks) * 100)

        return Response({
            'user': user.username,
            'attendance_days': attendance_count,
            'tasks_completed': completed_tasks,
            'task_completion_rate': f"{score}%",
            'performance': 'Good' if score >= 70 else 'Needs Improvement',
        })
