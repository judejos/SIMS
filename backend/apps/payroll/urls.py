from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PayrollViewSet, InternPaymentViewSet

router = DefaultRouter()
router.register(r'', PayrollViewSet)
router.register(r'intern-payments', InternPaymentViewSet, basename='intern-payment')

urlpatterns = [path('', include(router.urls))]
