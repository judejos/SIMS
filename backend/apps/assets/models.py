from django.db import models
from django.contrib.auth.models import User


class Asset(models.Model):
    STATUS_CHOICES = (('available', 'Available'), ('assigned', 'Assigned'), ('repair', 'Repair'))

    asset_name = models.CharField(max_length=100)
    asset_id = models.CharField(max_length=50, unique=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assets')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    purchase_date = models.DateField()
    image = models.ImageField(upload_to='assets/', null=True, blank=True)

    def __str__(self):
        return self.asset_name
