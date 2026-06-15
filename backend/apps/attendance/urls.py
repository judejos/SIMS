from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet, LeaveViewSet, WorkSessionViewSet

router = DefaultRouter()
router.register(r'leaves', LeaveViewSet, basename='leave')
router.register(r'timer', WorkSessionViewSet, basename='timer')
router.register(r'', AttendanceViewSet, basename='attendance')

urlpatterns = [path('', include(router.urls))]
