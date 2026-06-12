# SIMS — Student Intern Management System

A full-stack web application for managing interns, tasks, attendance, payroll, assets, and AI-powered tools.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Django 4.2, Django REST Framework |
| Auth | JWT (SimpleJWT) |
| AI | Google Gemini 1.5 Flash |
| Database | SQLite (dev) / PostgreSQL (prod) |

---

## Project Structure

```
SIMS/
├── backend/        Django REST API
├── frontend/       React SPA
└── database/       Schema, sample data, ER diagram
```

---

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

Copy `.env` and fill in values:
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
GEMINI_API_KEY=your-gemini-api-key
```

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Default Roles & Redirects

| Role | Login Redirects To |
|------|--------------------|
| admin / manager | `/admin` |
| intern | `/intern-user` |

---

## Dashboard URLs

| Dashboard | URL | Who |
|-----------|-----|-----|
| Admin | `/admin` | Admin, Manager |
| Intern Management | `/intern-mgmt` | Admin, Manager |
| Task | `/task` | All staff |
| Attendance | `/attendance` | All staff |
| Asset | `/asset` | All staff |
| Payroll | `/payroll` | Admin, Manager |
| Intern Self-Service | `/intern-user` | Intern |

---

## API Endpoints

| Base URL | Description |
|----------|-------------|
| `/api/auth/` | Login, register, logout, token refresh |
| `/api/users/` | User and profile management |
| `/api/interns/` | Intern records |
| `/api/attendance/` | Attendance tracking |
| `/api/tasks/` | Task management |
| `/api/projects/` | Projects |
| `/api/teams/` | Teams |
| `/api/payroll/` | Payroll records |
| `/api/assets/` | Asset management |
| `/api/documents/` | Document upload |
| `/api/feedback/` | Feedback |
| `/api/notifications/` | Notifications |
| `/api/reports/dashboard/` | Dashboard stats |
| `/api/ai/chatbot/` | AI chatbot |
| `/api/ai/resume/generate/` | Resume generator |
| `/api/ai/interview/start/` | Mock interview |
| `/api/ai/performance/<id>/` | Performance analysis |
| `/api/ai/learning-path/` | Learning path |

---

## Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy and paste into `.env` as `GEMINI_API_KEY`

---

## Production Checklist

- [ ] Set `DEBUG=False` in `.env`
- [ ] Set a strong `SECRET_KEY`
- [ ] Switch to PostgreSQL
- [ ] Set `ALLOWED_HOSTS` to your domain
- [ ] Run `python manage.py collectstatic`
- [ ] Run `npm run build` for frontend
- [ ] Set up HTTPS
