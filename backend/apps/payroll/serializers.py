from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Payroll, InternPayment


class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = '__all__'
        read_only_fields = ('final_salary',)


class InternPaymentSerializer(serializers.ModelSerializer):
    intern_name = serializers.SerializerMethodField()

    class Meta:
        model = InternPayment
        fields = (
            'id', 'intern', 'intern_name',
            'internship_fee', 'amount_paid', 'balance_amount',
            'payment_status', 'payment_method',
            'payment_date', 'transaction_id', 'remarks',
            'created_at', 'updated_at',
        )
        read_only_fields = ('balance_amount', 'payment_status', 'created_at', 'updated_at')

    def get_intern_name(self, obj):
        return obj.intern.get_full_name() or obj.intern.username
