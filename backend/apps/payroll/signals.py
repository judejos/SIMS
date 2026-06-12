from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Payroll


@receiver(post_save, sender=Payroll)
def notify_payroll_created(sender, instance, created, **kwargs):
    if created:
        try:
            from apps.notifications.models import Notification
            Notification.objects.create(
                recipient=instance.employee,
                message=f'Your payroll for {instance.payment_date} has been processed. Final salary: ₹{instance.final_salary}'
            )
        except Exception:
            pass
