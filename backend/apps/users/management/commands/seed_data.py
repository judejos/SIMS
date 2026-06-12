from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.users.models import Profile
from apps.interns.models import Intern
from apps.tasks.models import Task
from apps.attendance.models import Attendance
from apps.payroll.models import Payroll
from apps.assets.models import Asset
from apps.teams.models import Team
from apps.projects.models import Project
from apps.feedback.models import Feedback
from apps.notifications.models import Notification
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = 'Seed database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # --- Users ---
        users_data = [
            ('admin',    'Admin@1234',  'Admin',   'User',    True,  True,  'admin',   'Management'),
            ('manager1', 'Admin@1234',  'Ravi',    'Kumar',   True,  False, 'manager', 'Engineering'),
            ('manager2', 'Admin@1234',  'Priya',   'Sharma',  True,  False, 'manager', 'Design'),
            ('intern1',  'Intern@1234', 'Arjun',   'Mehta',   False, False, 'intern',  'Engineering'),
            ('intern2',  'Intern@1234', 'Sneha',   'Patel',   False, False, 'intern',  'Design'),
            ('intern3',  'Intern@1234', 'Karan',   'Singh',   False, False, 'intern',  'Engineering'),
            ('intern4',  'Intern@1234', 'Divya',   'Nair',    False, False, 'intern',  'Marketing'),
            ('intern5',  'Intern@1234', 'Rahul',   'Verma',   False, False, 'intern',  'Engineering'),
        ]

        created_users = {}
        for username, password, first, last, is_staff, is_super, role, dept in users_data:
            user, created = User.objects.get_or_create(username=username)
            if created or not user.has_usable_password():
                user.set_password(password)
            user.first_name = first
            user.last_name = last
            user.email = f'{username}@sims.com'
            user.is_staff = is_staff
            user.is_superuser = is_super
            user.save()
            profile, _ = Profile.objects.get_or_create(user=user)
            profile.role = role
            profile.department = dept
            profile.phone = f'900000000{list(users_data).index((username, password, first, last, is_staff, is_super, role, dept)) + 1}'
            profile.save()
            created_users[username] = user
            self.stdout.write(f'  User: {username} ({role})')

        # --- Teams ---
        team1, _ = Team.objects.get_or_create(name='Backend Team', defaults={'lead': created_users['manager1'], 'description': 'Server-side development'})
        team2, _ = Team.objects.get_or_create(name='Design Team', defaults={'lead': created_users['manager2'], 'description': 'UI/UX design'})
        team1.members.set([created_users['intern1'], created_users['intern3'], created_users['intern5']])
        team2.members.set([created_users['intern2'], created_users['intern4']])
        self.stdout.write('  Teams created')

        # --- Projects ---
        proj1, _ = Project.objects.get_or_create(name='SIMS Portal', defaults={
            'manager': created_users['manager1'], 'status': 'active',
            'start_date': date.today() - timedelta(days=60),
            'end_date': date.today() + timedelta(days=120),
            'description': 'Student Intern Management System'
        })
        proj1.members.set([created_users['intern1'], created_users['intern3']])
        self.stdout.write('  Projects created')

        # --- Interns ---
        intern_users = ['intern1', 'intern2', 'intern3', 'intern4', 'intern5']
        mentors = ['manager1', 'manager1', 'manager1', 'manager2', 'manager1']
        for uname, mentor_name in zip(intern_users, mentors):
            Intern.objects.get_or_create(
                user=created_users[uname],
                defaults={
                    'mentor': created_users[mentor_name],
                    'college': random.choice(['IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'NID Ahmedabad', 'Delhi University']),
                    'degree': random.choice(['B.Tech CS', 'B.Des', 'BBA', 'B.Tech IT']),
                    'start_date': date.today() - timedelta(days=random.randint(30, 90)),
                    'end_date': date.today() + timedelta(days=random.randint(60, 180)),
                    'status': 'active',
                }
            )
        self.stdout.write('  Interns created')

        # --- Tasks ---
        task_data = [
            ('Setup Django REST API', 'Configure DRF and JWT', 'intern1', 'manager1', 'high', 'completed'),
            ('Design Login Page', 'Create Figma mockups', 'intern2', 'manager2', 'high', 'completed'),
            ('Implement Attendance Module', 'Build attendance API', 'intern3', 'manager1', 'high', 'in_progress'),
            ('Create User Dashboard UI', 'React components', 'intern1', 'manager1', 'medium', 'in_progress'),
            ('Write API Documentation', 'Document all endpoints', 'intern3', 'manager1', 'medium', 'pending'),
            ('Design Asset Management UI', 'Figma designs', 'intern2', 'manager2', 'medium', 'in_progress'),
            ('Implement Payroll Module', 'Build payroll API', 'intern5', 'manager1', 'high', 'pending'),
            ('Marketing Landing Page', 'Design landing page', 'intern4', 'manager2', 'medium', 'in_progress'),
            ('Unit Tests for Auth', 'Write pytest tests', 'intern1', 'manager1', 'medium', 'completed'),
            ('Setup CI/CD Pipeline', 'GitHub Actions', 'intern3', 'manager1', 'low', 'pending'),
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
                    'due_date': date.today() + timedelta(days=random.randint(5, 30)),
                }
            )
        self.stdout.write('  Tasks created')

        # --- Attendance ---
        today = date.today()
        statuses = ['present', 'present', 'present', 'late', 'absent']
        for i in range(10):
            day = today - timedelta(days=i)
            if day.weekday() >= 5:
                continue
            for uname in intern_users:
                Attendance.objects.get_or_create(
                    user=created_users[uname],
                    date=day,
                    defaults={
                        'check_in': '09:00',
                        'check_out': '18:00',
                        'status': random.choice(statuses),
                    }
                )
        self.stdout.write('  Attendance created')

        # --- Payroll ---
        for uname in intern_users:
            basic = random.choice([12000, 15000, 18000])
            bonus = random.choice([0, 500, 1000])
            deductions = 500
            Payroll.objects.get_or_create(
                employee=created_users[uname],
                payment_date=date.today().replace(day=1),
                defaults={
                    'basic_salary': basic,
                    'bonus': bonus,
                    'deductions': deductions,
                    'final_salary': basic + bonus - deductions,
                }
            )
        self.stdout.write('  Payroll created')

        # --- Assets ---
        assets_data = [
            ('MacBook Pro 14"', 'ASSET-001', 'intern1', 'assigned'),
            ('Dell Monitor 27"', 'ASSET-002', 'intern1', 'assigned'),
            ('MacBook Air M2', 'ASSET-003', 'intern2', 'assigned'),
            ('ThinkPad X1', 'ASSET-004', 'intern3', 'assigned'),
            ('Dell Laptop', 'ASSET-005', None, 'available'),
            ('HP Monitor', 'ASSET-006', None, 'available'),
            ('Mechanical Keyboard', 'ASSET-007', None, 'repair'),
        ]
        for name, asset_id, assignee, status in assets_data:
            Asset.objects.get_or_create(
                asset_id=asset_id,
                defaults={
                    'asset_name': name,
                    'assigned_to': created_users[assignee] if assignee else None,
                    'status': status,
                    'purchase_date': date.today() - timedelta(days=random.randint(100, 500)),
                }
            )
        self.stdout.write('  Assets created')

        # --- Feedback ---
        for uname in ['intern1', 'intern2', 'intern3']:
            Feedback.objects.get_or_create(
                given_by=created_users['manager1'],
                given_to=created_users[uname],
                defaults={
                    'rating': random.randint(3, 5),
                    'comments': 'Good progress. Keep it up!',
                }
            )
        self.stdout.write('  Feedback created')

        # --- Notifications ---
        for uname in intern_users:
            Notification.objects.get_or_create(
                recipient=created_users[uname],
                message='Welcome to SIMS! Your onboarding is complete.',
                defaults={'is_read': False}
            )
        self.stdout.write('  Notifications created')

        self.stdout.write(self.style.SUCCESS('\nSeed complete! Login credentials:'))
        self.stdout.write('  admin    / Admin@1234  (superuser)')
        self.stdout.write('  manager1 / Admin@1234  (manager)')
        self.stdout.write('  intern1  / Intern@1234 (intern)')
