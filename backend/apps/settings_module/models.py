from django.db import models


class Entity(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Entities'


class Branch(models.Model):
    entity = models.ForeignKey(Entity, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.entity.name} - {self.name}"

    class Meta:
        verbose_name_plural = 'Branches'


class Department(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='departments')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Domain(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='domains')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default='SIMS')
    contact_email = models.EmailField(blank=True)
    max_interns = models.IntegerField(default=50)
    internship_duration_months = models.IntegerField(default=6)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_name
