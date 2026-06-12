from django.contrib.auth.models import User
from .analyzer import get_raw_metrics, analyze_performance


def generate_team_report(user_ids: list) -> dict:
    team_metrics = []
    for uid in user_ids:
        try:
            user = User.objects.get(pk=uid)
            team_metrics.append(get_raw_metrics(user))
        except User.DoesNotExist:
            continue

    if not team_metrics:
        return {'error': 'No valid users found'}

    avg_task_rate = sum(m['task_completion_rate'] for m in team_metrics) / len(team_metrics)
    avg_attendance = sum(m['attendance_rate'] for m in team_metrics) / len(team_metrics)
    top_performer = max(team_metrics, key=lambda m: m['task_completion_rate'])

    return {
        'team_size': len(team_metrics),
        'avg_task_completion_rate': round(avg_task_rate, 1),
        'avg_attendance_rate': round(avg_attendance, 1),
        'top_performer': top_performer['user'],
        'members': team_metrics,
    }


def generate_individual_report(user_id: int) -> dict:
    try:
        user = User.objects.get(pk=user_id)
        return analyze_performance(user)
    except User.DoesNotExist:
        return {'error': 'User not found'}
