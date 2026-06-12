from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Task


@receiver(post_save, sender=Task)
def notify_task_assigned(sender, instance, created, **kwargs):
    if created and instance.assigned_to:
        try:
            from apps.notifications.models import Notification
            Notification.objects.create(
                recipient=instance.assigned_to,
                message=f'New task assigned to you: "{instance.title}" — Due: {instance.due_date or "No due date"}'
            )
        except Exception:
            pass


@receiver(post_save, sender=Task)
def notify_task_completed(sender, instance, created, **kwargs):
    if not created and instance.status == 'completed' and instance.assigned_by:
        try:
            from apps.notifications.models import Notification
            Notification.objects.create(
                recipient=instance.assigned_by,
                message=f'Task "{instance.title}" has been marked as completed by {instance.assigned_to}'
            )
        except Exception:
            pass
