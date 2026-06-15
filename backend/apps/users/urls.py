from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ProfileViewSet

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)
router.register(r'', UserViewSet, basename='users')

urlpatterns = [path('', include(router.urls))]
