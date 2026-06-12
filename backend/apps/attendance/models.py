from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Attendance(models.Model):
    STATUS_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('half_day', 'Half Day'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance')
    date = models.DateField()
    check_in = models.TimeField(null=True, blank=True)       # first check-in of the day
    check_out = models.TimeField(null=True, blank=True)      # last check-out of the day
    break_start = models.TimeField(null=True, blank=True)
    break_end = models.TimeField(null=True, blank=True)
    working_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.status}"


class WorkSession(models.Model):
    """
    One record per user per day — tracks the day-level state and
    accumulates totals across all WorkSegments.
    """
    STATE_CHOICES = (
        ('idle',        'Idle'),
        ('working',     'Working'),
        ('paused',      'Paused'),
        ('checked_out', 'Checked Out'),   # segment ended, can resume
        ('day_ended',   'Day Ended'),     # explicitly ended, no more work today
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='work_sessions')
    date = models.DateField()
    state = models.CharField(max_length=15, choices=STATE_CHOICES, default='idle')

    # Accumulated totals across ALL segments
    worked_seconds = models.PositiveIntegerField(default=0)
    break_seconds  = models.PositiveIntegerField(default=0)

    # Pointer used within the current active segment
    last_paused_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'date')

    def active_worked_seconds(self):
        total = self.worked_seconds
        if self.state == 'working' and self.last_paused_at:
            total += int((timezone.now() - self.last_paused_at).total_seconds())
        return total

    def active_break_seconds(self):
        total = self.break_seconds
        if self.state == 'paused' and self.last_paused_at:
            total += int((timezone.now() - self.last_paused_at).total_seconds())
        return total

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.state}"


class WorkSegment(models.Model):
    """
    One row per individual check-in / check-out pair within a day.
    Example: 09:00-13:00 is segment 1, 15:00-17:00 is segment 2.
    """
    session    = models.ForeignKey(WorkSession, on_delete=models.CASCADE, related_name='segments')
    started_at = models.DateTimeField()
    ended_at   = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.PositiveIntegerField(default=0)  # filled on checkout

    class Meta:
        ordering = ['started_at']

    def __str__(self):
        return f"Segment {self.id} — {self.session.user.username} {self.started_at}"


class Leave(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    LEAVE_TYPE_CHOICES = (
        ('sick', 'Sick'),
        ('casual', 'Casual'),
        ('emergency', 'Emergency'),
        ('other', 'Other'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaves')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES, default='casual')
    from_date = models.DateField()
    to_date = models.DateField()
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_leaves')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.leave_type} ({self.from_date} to {self.to_date})"
