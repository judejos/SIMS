from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    STATUS_CHOICES = (('active', 'Active'), ('completed', 'Completed'), ('on_hold', 'On Hold'))

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='managed_projects')
    members = models.ManyToManyField(User, blank=True, related_name='projects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
