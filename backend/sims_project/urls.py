from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/interns/', include('apps.interns.urls')),
    path('api/attendance/', include('apps.attendance.urls')),
    path('api/tasks/', include('apps.tasks.urls')),
    path('api/projects/', include('apps.projects.urls')),
    path('api/teams/', include('apps.teams.urls')),
    path('api/payroll/', include('apps.payroll.urls')),
    path('api/assets/', include('apps.assets.urls')),
    path('api/documents/', include('apps.documents.urls')),
    path('api/feedback/', include('apps.feedback.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/certificates/', include('apps.certificates.urls')),
    path('api/settings/', include('apps.settings_module.urls')),
    path('api/ai/', include('apps.ai_module.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
