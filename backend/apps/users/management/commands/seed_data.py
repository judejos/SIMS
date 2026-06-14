from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.users.models import Profile
from apps.interns.models import Intern
from apps.tasks.models import Task
from apps.attendance.models import Attendance, Leave
from apps.payroll.models import Payroll, InternPayment
from apps.assets.models import Asset
from apps.teams.models import Team
from apps.projects.models import Project
from apps.feedback.models import Feedback
from apps.notifications.models import Notification
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Seed database with test data matching specifications'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Clean existing user data
        User.objects.all().delete()
        Team.objects.all().delete()
        Project.objects.all().delete()
        Intern.objects.all().delete()
        Task.objects.all().delete()
        Attendance.objects.all().delete()
        Leave.objects.all().delete()
        Payroll.objects.all().delete()
        InternPayment.objects.all().delete()
        Asset.objects.all().delete()
        Feedback.objects.all().delete()
        Notification.objects.all().delete()

        # --- Users ---
        users_data = [
            # username, password, first, last, is_staff, is_super, role, dept
            (
                'Admin', 'Vdart@123', 'Super', 'Admin', True, True, 'admin',
                'Administration'
            ),
            (
                'Manager', 'Vdart@123', 'John', 'Manager', True, False,
                'manager', 'Management'
            ),
            (
                'Lead', 'Vdart@123', 'Robert', 'Lead', True, False, 'lead',
                'Engineering'
            ),
            (
                'SME', 'Vdart@123', 'Sarah', 'SME', True, False, 'sme',
                'Subject Matter Experts'
            ),
            (
                'Mentor', 'Vdart@123', 'Alice', 'Mentor', True, False,
                'mentor', 'Training'
            ),
            (
                'Intern', 'Vdart@123', 'David', 'Intern', False, False,
                'intern', 'Development'
            ),
        ]

        created_users = {}
        for username, password, first, last, is_staff, is_super, role, dept in users_data:
            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first,
                last_name=last,
                email=f'{username.lower()}@sims.com',
                is_staff=is_staff,
                is_superuser=is_super
            )
            profile, _ = Profile.objects.get_or_create(user=user)
            profile.role = role
            profile.department = dept
            profile.phone = f'900000000{list(users_data).index((username, password, first, last, is_staff, is_super, role, dept)) + 1}'
            profile.save()
            created_users[username] = user
            self.stdout.write(f'  User: {username} ({role})')

        # --- Teams ---
        team1, _ = Team.objects.get_or_create(
            name='Engineering Team', 
            defaults={'lead': created_users['Lead'], 'description': 'Software Engineering and Development'}
        )
        team1.members.set([created_users['Intern']])
        self.stdout.write('  Teams created')

        # --- Projects ---
        proj1, _ = Project.objects.get_or_create(name='SIMS Portal', defaults={
            'manager': created_users['Manager'], 
            'status': 'active',
            'start_date': date.today() - timedelta(days=30),
            'end_date': date.today() + timedelta(days=90),
            'description': 'Student Intern Management System'
        })
        proj1.members.set([created_users['Intern']])
        self.stdout.write('  Projects created')

        # --- Interns ---
        Intern.objects.get_or_create(
            user=created_users['Intern'],
            defaults={
                'mentor': created_users['Mentor'],
                'college': 'BITS Pilani',
                'degree': 'B.Tech CS',
                'start_date': date.today() - timedelta(days=30),
                'end_date': date.today() + timedelta(days=90),
                'status': 'active',
                'domain': 'Development',
                'scheme': 'paid',
                'intern_department': 'Development',
            }
        )
        self.stdout.write('  Intern created')

        # --- Tasks ---
        task_data = [
            ('Setup Django REST API', 'Configure DRF and JWT', 'Intern', 'Lead', 'high', 'completed'),
            ('Design Login Page', 'Create Figma mockups', 'Intern', 'Lead', 'high', 'completed'),
            ('Implement Attendance Module', 'Build attendance API', 'Intern', 'Lead', 'high', 'in_progress'),
            ('Create User Dashboard UI', 'React components', 'Intern', 'Mentor', 'medium', 'in_progress'),
            ('Write API Documentation', 'Document all endpoints', 'Intern', 'SME', 'medium', 'pending'),
        ]
        for title, desc, assignee, assigner, priority, status in task_data:
            Task.objects.get_or_create(
                title=title,
                defaults={
                    'description': desc,
                    'assigned_to': created_users[assignee],
                    'assigned_by': created_users[assigner],
                    'priority': priority,
                    'status': status,
                    'due_date': date.today() + timedelta(days=15),
                }
            )
        self.stdout.write('  Tasks created')

        # --- Attendance ---
        today = date.today()
        for i in range(15):
            day = today - timedelta(days=i)
            if day.weekday() >= 5:
                continue
            Attendance.objects.get_or_create(
                user=created_users['Intern'],
                date=day,
                defaults={
                    'check_in': '09:00',
                    'check_out': '18:00',
                    'status': 'present',
                    'working_hours': 9.0
                }
            )
        self.stdout.write('  Attendance created')

        # --- Leave ---
        Leave.objects.get_or_create(
            user=created_users['Intern'],
            leave_type='sick',
            from_date=date.today() + timedelta(days=5),
            to_date=date.today() + timedelta(days=6),
            reason='Medical checkup',
            status='pending'
        )
        self.stdout.write('  Leave request created')

        # --- Payroll & Payments ---
        Payroll.objects.get_or_create(
            employee=created_users['Intern'],
            payment_date=date.today().replace(day=1),
            defaults={
                'basic_salary': 15000,
                'bonus': 1000,
                'deductions': 500,
                'final_salary': 15500,
            }
        )
        InternPayment.objects.get_or_create(
            intern=created_users['Intern'],
            payment_status='PARTIALLY_PAID',
            amount_paid=15000,
            balance_amount=10000,
            internship_fee=25000,
            payment_method='bank_transfer',
            transaction_id='TXN-SIMS-992'
        )
        self.stdout.write('  Payroll & Payments created')

        # --- Assets ---
        assets_data = [
            ('MacBook Pro 14"', 'ASSET-001', 'Intern', 'assigned'),
            ('Dell Monitor 27"', 'ASSET-002', 'Intern', 'assigned'),
            ('ThinkPad X1', 'ASSET-003', None, 'available'),
        ]
        for name, asset_id, assignee, status in assets_data:
            Asset.objects.get_or_create(
                asset_id=asset_id,
                defaults={
                    'asset_name': name,
                    'assigned_to': created_users[assignee] if assignee else None,
                    'status': status,
                    'purchase_date': date.today() - timedelta(days=120),
                }
            )
        self.stdout.write('  Assets created')

        # --- Feedback ---
        Feedback.objects.get_or_create(
            given_by=created_users['Mentor'],
            given_to=created_users['Intern'],
            defaults={
                'rating': 5,
                'comments': 'Excellent performance on frontend components!',
            }
        )
        self.stdout.write('  Feedback created')

        # --- Notifications ---
        Notification.objects.get_or_create(
            recipient=created_users['Intern'],
            message='Welcome to SIMS! Your onboarding is complete.',
            defaults={'is_read': False}
        )
        self.stdout.write('  Notifications created')

        self.stdout.write(self.style.SUCCESS('\nSeed complete! New login credentials (password: Vdart@123):'))
        for u, user_obj in created_users.items():
            fresh_profile = Profile.objects.get(user=user_obj)
            self.stdout.write(f'  {u} ({fresh_profile.role})')
