from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('lead', 'Lead'),
        ('sme', 'SME'),
        ('mentor', 'Mentor'),
        ('intern', 'Intern'),
    )


    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='intern')
    phone = models.CharField(max_length=20, blank=True)
    department = models.CharField(max_length=100, blank=True)
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    joined_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
