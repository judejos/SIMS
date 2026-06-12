# SIMS Database

## Files

| File | Description |
|------|-------------|
| `schema.sql` | Full database schema — all tables, constraints, indexes |
| `sample_data.sql` | Realistic test data for development |
| `er_diagram.dbml` | DBML source for ER diagram generation |
| `migrations_backup/` | Backup of Django migration files |

## Tables

| Table | Description |
|-------|-------------|
| `auth_user` | Django built-in users |
| `users_profile` | Extended user profile (role, department, photo) |
| `interns_intern` | Intern-specific data (college, mentor, status) |
| `teams_team` | Teams with lead and members |
| `projects_project` | Projects with manager and members |
| `tasks_task` | Tasks assigned to users |
| `attendance_attendance` | Daily attendance records |
| `payroll_payroll` | Monthly payroll records |
| `assets_asset` | Company assets and assignments |
| `documents_document` | Uploaded documents |
| `feedback_feedback` | Manager-to-intern feedback with ratings |
| `notifications_notification` | User notifications |
| `certificates_certificate` | Completion certificates |
| `settings_module_sitesettings` | System-wide settings |

## Generate ER Diagram

1. Go to **https://dbdiagram.io**
2. Click **Import** → paste contents of `er_diagram.dbml`
3. Export as PNG → save as `er_diagram.png`

## Load Sample Data (Django)

```bash
cd backend
venv\Scripts\activate
python manage.py makemigrations
python manage.py migrate
python manage.py shell

# Then in shell:
from django.contrib.auth.models import User
User.objects.create_superuser('admin', 'admin@sims.com', 'Admin@1234')
```

## Using with PostgreSQL

Change `.env`:
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=sims_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

Update `settings.py` DATABASES to include HOST, PORT, USER, PASSWORD from env.
