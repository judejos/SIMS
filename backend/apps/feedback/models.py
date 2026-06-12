from django.db import models
from django.contrib.auth.models import User


class Feedback(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]

    given_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_feedback')
    given_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_feedback')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.given_by} to {self.given_to}"
