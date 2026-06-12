from django.db import models
from django.contrib.auth.models import User


class Certificate(models.Model):
    intern = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    title = models.CharField(max_length=200)
    issued_date = models.DateField()
    file = models.FileField(upload_to='certificates/', null=True, blank=True)
    issued_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='issued_certificates')

    def __str__(self):
        return f"{self.title} - {self.intern.username}"
