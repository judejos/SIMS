from django.db import models
from django.contrib.auth.models import User


class Intern(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('terminated', 'Terminated'),
    )
    SCHEME_CHOICES = (
        ('free', 'Free'),
        ('paid', 'Paid'),
        ('stipend', 'Stipend'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='intern')
    # Personal
    phone = models.CharField(max_length=20, blank=True)
    dob = models.DateField(null=True, blank=True)
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    aadhar_number = models.CharField(max_length=20, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    # Academic
    college = models.CharField(max_length=200, blank=True)
    degree = models.CharField(max_length=100, blank=True)
    intern_department = models.CharField(max_length=100, blank=True)
    registration_number = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    year_of_passing = models.CharField(max_length=4, blank=True)
    # Internship
    domain = models.CharField(max_length=100, blank=True)
    shift_timing = models.CharField(max_length=50, blank=True)
    scheme = models.CharField(max_length=10, choices=SCHEME_CHOICES, default='free')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    mentor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='mentees')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_interns')
    approved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - Intern"
