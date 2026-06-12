from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal


class Payroll(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    )
    INTERN_TYPE_CHOICES = (
        ('free', 'Free'),
        ('paid', 'Paid'),
        ('stipend', 'Stipend'),
    )

    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payrolls')
    intern_type = models.CharField(max_length=10, choices=INTERN_TYPE_CHOICES, default='free')
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_salary = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    payment_date = models.DateField()
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.final_salary = self.basic_salary + self.bonus - self.deductions
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.username} - {self.payment_date}"


class InternPayment(models.Model):
    STATUS_PAID           = 'PAID'
    STATUS_UNPAID         = 'UNPAID'
    STATUS_PARTIAL        = 'PARTIALLY_PAID'
    PAYMENT_STATUS_CHOICES = (
        (STATUS_PAID,    'Paid'),
        (STATUS_UNPAID,  'Unpaid'),
        (STATUS_PARTIAL, 'Partially Paid'),
    )
    METHOD_CHOICES = (
        ('cash',          'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('upi',           'UPI'),
        ('cheque',        'Cheque'),
        ('other',         'Other'),
    )

    intern          = models.ForeignKey(User, on_delete=models.CASCADE, related_name='intern_payments')
    internship_fee  = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid     = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_amount  = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    payment_status  = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, editable=False)
    payment_method  = models.CharField(max_length=20, choices=METHOD_CHOICES, default='cash')
    payment_date    = models.DateField(null=True, blank=True)
    transaction_id  = models.CharField(max_length=100, blank=True)
    remarks         = models.TextField(blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.balance_amount = self.internship_fee - self.amount_paid
        paid = Decimal(str(self.amount_paid))
        fee  = Decimal(str(self.internship_fee))
        if paid >= fee:
            self.payment_status = self.STATUS_PAID
        elif paid <= 0:
            self.payment_status = self.STATUS_UNPAID
        else:
            self.payment_status = self.STATUS_PARTIAL
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.intern.get_full_name() or self.intern.username} - {self.payment_status}"
