from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Intern
from .serializers import InternSerializer
from apps.permissions import IsAdminOrManager


class InternViewSet(viewsets.ModelViewSet):
    queryset = Intern.objects.select_related('user', 'mentor', 'approved_by').all()
    serializer_class = InternSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'mentor', 'domain', 'scheme']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'college', 'degree', 'domain']
    ordering_fields = ['start_date', 'end_date', 'status']
    ordering = ['-start_date']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile:
            if profile.role == 'intern':
                qs = qs.filter(user=user)
            elif profile.role == 'mentor':
                qs = qs.filter(mentor=user)
            elif profile.role in ('lead', 'sme'):
                qs = qs.filter(user__profile__department=profile.department)
        return qs

    def get_permissions(self):
        if self.action == 'submit_onboarding':
            return [permissions.AllowAny()]
        if self.action in ('create', 'update', 'partial_update', 'destroy', 'approve', 'reject'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['post'], url_path='onboarding/submit')
    def submit_onboarding(self, request):
        from django.contrib.auth.models import User
        from django.db import transaction
        data = request.data
        
        # Check if email/username already exists
        email = data.get('email')
        emp_id = data.get('employee_id')
        
        if User.objects.filter(username=emp_id).exists() or User.objects.filter(email=email).exists():
            return Response({'error': 'Employee ID or Email already exists'}, status=400)
            
        with transaction.atomic():
            # Create a disabled User
            user = User.objects.create_user(
                username=emp_id,
                email=email,
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                is_active=False
            )
            # Profile will be auto-created by signals or we create it if not
            if not hasattr(user, 'profile'):
                from apps.users.models import Profile
                Profile.objects.create(user=user, role='intern', department=data.get('college_department', ''))
            
            # Create the Intern
            Intern.objects.create(
                user=user,
                phone=data.get('phone', ''),
                dob=data.get('dob', None) or None,
                aadhar_number=data.get('aadhar_number', ''),
                gender=data.get('gender', ''),
                college=data.get('college_name', ''),
                degree=data.get('degree', ''),
                intern_department=data.get('college_department', ''),
                registration_number=data.get('registration_number', ''),
                location=data.get('location', ''),
                year_of_passing=data.get('year_of_passing', ''),
                domain=data.get('domain', ''),
                shift_timing=data.get('shift_timing', ''),
                scheme=data.get('scheme', 'free'),
                start_date=data.get('start_date', None) or None,
                end_date=data.get('end_date', None) or None,
                status='pending'
            )
            
        return Response({'message': 'Onboarding submitted successfully', 'status': 'Pending'}, status=201)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        intern = self.get_object()
        intern.status = 'active'
        intern.approved_by = request.user
        intern.approved_at = timezone.now()
        intern.save()
        return Response({'status': 'active'})

    @action(detail=False, methods=['post'], url_path='bulk_import')
    def bulk_import(self, request):
        import csv
        import io
        from django.contrib.auth.models import User
        from django.db import transaction
        
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
            
        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        created_count = 0
        errors = []
        
        with transaction.atomic():
            for row in reader:
                try:
                    emp_id = row.get('employee_id')
                    email = row.get('email')
                    
                    if not emp_id or not email:
                        errors.append(f"Row {reader.line_num}: Missing employee_id or email")
                        continue
                        
                    if User.objects.filter(username=emp_id).exists() or User.objects.filter(email=email).exists():
                        errors.append(f"Row {reader.line_num}: Employee ID or Email already exists")
                        continue
                        
                    user = User.objects.create_user(
                        username=emp_id,
                        email=email,
                        first_name=row.get('first_name', ''),
                        last_name=row.get('last_name', ''),
                        is_active=False
                    )
                    
                    from apps.users.models import Profile
                    Profile.objects.create(user=user, role='intern', department=row.get('department', ''))
                    
                    Intern.objects.create(
                        user=user,
                        college=row.get('college', ''),
                        degree=row.get('degree', ''),
                        intern_department=row.get('department', ''),
                        domain=row.get('domain', ''),
                        status='pending'
                    )
                    created_count += 1
                except Exception as e:
                    errors.append(f"Row {reader.line_num}: {str(e)}")
                    
        return Response({'message': f'Imported {created_count} interns', 'errors': errors})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        intern = self.get_object()
        intern.status = 'terminated'
        intern.approved_by = request.user
        intern.approved_at = timezone.now()
        intern.save()
        return Response({'status': 'terminated'})
