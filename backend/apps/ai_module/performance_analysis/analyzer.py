from django.contrib.auth.models import User
from apps.attendance.models import Attendance
from apps.tasks.models import Task
from ..utils.gemini_api import call_gemini


def get_raw_metrics(user: User) -> dict:
    total_tasks = Task.objects.filter(assigned_to=user).count()
    completed_tasks = Task.objects.filter(assigned_to=user, status='completed').count()
    in_progress = Task.objects.filter(assigned_to=user, status='in_progress').count()
    present_days = Attendance.objects.filter(user=user, status='present').count()
    late_days = Attendance.objects.filter(user=user, status='late').count()
    absent_days = Attendance.objects.filter(user=user, status='absent').count()
    total_days = present_days + late_days + absent_days

    task_rate = round((completed_tasks / total_tasks * 100)) if total_tasks else 0
    attendance_rate = round((present_days / total_days * 100)) if total_days else 0

    return {
        'user': user.username,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'in_progress_tasks': in_progress,
        'task_completion_rate': task_rate,
        'present_days': present_days,
        'late_days': late_days,
        'absent_days': absent_days,
        'attendance_rate': attendance_rate,
    }


def analyze_performance(user: User) -> dict:
    metrics = get_raw_metrics(user)
    prompt = f"""
Analyze this intern's performance data and provide insights:

Name: {metrics['user']}
Task Completion Rate: {metrics['task_completion_rate']}%
Tasks Completed: {metrics['completed_tasks']} / {metrics['total_tasks']}
Attendance Rate: {metrics['attendance_rate']}%
Present Days: {metrics['present_days']}, Late: {metrics['late_days']}, Absent: {metrics['absent_days']}

Provide:
1. Overall performance rating (Excellent/Good/Average/Needs Improvement)
2. Key strengths (2-3 points)
3. Areas for improvement (2-3 points)
4. Specific recommendations
"""
    ai_analysis = call_gemini(prompt, max_tokens=800)
    return {**metrics, 'ai_analysis': ai_analysis}
