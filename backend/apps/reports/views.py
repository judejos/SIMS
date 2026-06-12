from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from apps.attendance.models import Attendance
from apps.payroll.models import Payroll
from apps.tasks.models import Task
from apps.interns.models import Intern
from apps.feedback.models import Feedback


class DashboardReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        month_start = today.replace(day=1)

        total_users = User.objects.count()
        total_interns = Intern.objects.count()
        active_interns = Intern.objects.filter(status='active').count()
        completed_interns = Intern.objects.filter(status='completed').count()

        total_tasks = Task.objects.count()
        completed_tasks = Task.objects.filter(status='completed').count()
        pending_tasks = Task.objects.filter(status='pending').count()
        in_progress_tasks = Task.objects.filter(status='in_progress').count()

        total_attendance = Attendance.objects.count()
        present_today = Attendance.objects.filter(date=today, status='present').count()
        attendance_rate = 0
        if total_attendance:
            present = Attendance.objects.filter(status='present').count()
            attendance_rate = round((present / total_attendance) * 100)

        total_payrolls = Payroll.objects.count()
        monthly_payroll = Payroll.objects.filter(
            payment_date__gte=month_start
        ).values_list('final_salary', flat=True)
        total_monthly = sum(float(s) for s in monthly_payroll)

        avg_feedback = 0
        feedbacks = Feedback.objects.values_list('rating', flat=True)
        if feedbacks:
            avg_feedback = round(sum(feedbacks) / len(feedbacks), 1)

        return Response({
            'total_users': total_users,
            'total_interns': total_interns,
            'active_interns': active_interns,
            'completed_interns': completed_interns,
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'in_progress_tasks': in_progress_tasks,
            'total_attendance': total_attendance,
            'present_today': present_today,
            'attendance_rate': attendance_rate,
            'total_payrolls': total_payrolls,
            'total_monthly_payroll': round(total_monthly, 2),
            'avg_feedback_rating': avg_feedback,
        })
