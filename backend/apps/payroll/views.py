from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from .models import Payroll, InternPayment
from .serializers import PayrollSerializer, InternPaymentSerializer
from apps.permissions import IsAdminOrManager


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.select_related('employee').all()
    serializer_class = PayrollSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['employee', 'payment_date']
    search_fields = ['employee__username', 'employee__first_name']
    ordering_fields = ['payment_date', 'final_salary']
    ordering = ['-payment_date']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'intern':
            qs = qs.filter(employee=user)
        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]


class InternPaymentViewSet(viewsets.ModelViewSet):
    queryset = InternPayment.objects.select_related('intern').all()
    serializer_class = InternPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['payment_status', 'payment_method', 'intern']
    search_fields = ['intern__username', 'intern__first_name', 'intern__last_name', 'transaction_id']
    ordering_fields = ['payment_date', 'created_at', 'amount_paid']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'intern':
            return qs.filter(intern=user)
        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]

    # GET /api/intern-payments/summary/
    @action(detail=False, methods=['get'], permission_classes=[IsAdminOrManager])
    def summary(self, request):
        qs = InternPayment.objects.all()
        agg = qs.aggregate(
            total_fee=Sum('internship_fee'),
            total_paid=Sum('amount_paid'),
            total_balance=Sum('balance_amount'),
        )
        counts = qs.values('payment_status').annotate(count=Count('id'))
        status_map = {c['payment_status']: c['count'] for c in counts}
        return Response({
            'total_fee':      agg['total_fee'] or 0,
            'total_paid':     agg['total_paid'] or 0,
            'total_pending':  agg['total_balance'] or 0,
            'paid_count':     status_map.get('PAID', 0),
            'unpaid_count':   status_map.get('UNPAID', 0),
            'partial_count':  status_map.get('PARTIALLY_PAID', 0),
            'total_interns':  qs.count(),
        })
