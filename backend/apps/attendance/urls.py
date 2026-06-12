from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet, LeaveViewSet, WorkSessionViewSet

router = DefaultRouter()
router.register(r'', AttendanceViewSet)
router.register(r'leaves', LeaveViewSet, basename='leave')
router.register(r'timer', WorkSessionViewSet, basename='timer')

urlpatterns = [path('', include(router.urls))]
