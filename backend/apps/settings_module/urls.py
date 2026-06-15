from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteSettingsViewSet, EntityViewSet, BranchViewSet, DepartmentViewSet, DomainViewSet

router = DefaultRouter()
router.register(r'entities', EntityViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'domains', DomainViewSet)
router.register(r'', SiteSettingsViewSet, basename='site-settings')

urlpatterns = [path('', include(router.urls))]
