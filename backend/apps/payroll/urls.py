from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PayrollViewSet, InternPaymentViewSet

router = DefaultRouter()
router.register(r'intern-payments', InternPaymentViewSet, basename='intern-payment')
router.register(r'', PayrollViewSet, basename='payroll')

urlpatterns = [path('', include(router.urls))]
