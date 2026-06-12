-- ============================================================
-- SIMS - Student Intern Management System
-- Database Schema (SQLite / PostgreSQL compatible)
-- ============================================================

-- ============================================================
-- AUTH (Django built-in)
-- ============================================================

CREATE TABLE IF NOT EXISTS auth_user (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        VARCHAR(150) NOT NULL UNIQUE,
    email           VARCHAR(254) NOT NULL,
    password        VARCHAR(128) NOT NULL,
    first_name      VARCHAR(150) NOT NULL DEFAULT '',
    last_name       VARCHAR(150) NOT NULL DEFAULT '',
    is_staff        BOOLEAN NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT 1,
    is_superuser    BOOLEAN NOT NULL DEFAULT 0,
    date_joined     DATETIME NOT NULL,
    last_login      DATETIME
);

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users_profile (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL UNIQUE REFERENCES auth_user(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL DEFAULT 'intern'
                        CHECK(role IN ('admin', 'manager', 'intern')),
    phone           VARCHAR(20) NOT NULL DEFAULT '',
    department      VARCHAR(100) NOT NULL DEFAULT '',
    photo           VARCHAR(255),
    resume          VARCHAR(255),
    joined_date     DATE
);

-- ============================================================
-- INTERNS
-- ============================================================

CREATE TABLE IF NOT EXISTS interns_intern (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL UNIQUE REFERENCES auth_user(id) ON DELETE CASCADE,
    mentor_id       INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    college         VARCHAR(200) NOT NULL DEFAULT '',
    degree          VARCHAR(100) NOT NULL DEFAULT '',
    start_date      DATE NOT NULL,
    end_date        DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK(status IN ('active', 'completed', 'terminated'))
);

-- ============================================================
-- TEAMS
-- ============================================================

CREATE TABLE IF NOT EXISTS teams_team (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100) NOT NULL,
    lead_id         INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    description     TEXT NOT NULL DEFAULT '',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams_team_members (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id         INTEGER NOT NULL REFERENCES teams_team(id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    UNIQUE(team_id, user_id)
);

-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS projects_project (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL DEFAULT '',
    manager_id      INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK(status IN ('active', 'completed', 'on_hold')),
    start_date      DATE,
    end_date        DATE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects_project_members (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL REFERENCES projects_project(id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);

-- ============================================================
-- TASKS
-- ============================================================

CREATE TABLE IF NOT EXISTS tasks_task (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL DEFAULT '',
    assigned_to_id  INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    assigned_by_id  INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    priority        VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK(priority IN ('low', 'medium', 'high')),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK(status IN ('pending', 'in_progress', 'completed')),
    due_date        DATE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS attendance_attendance (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    check_in        TIME,
    check_out       TIME,
    status          VARCHAR(20) NOT NULL DEFAULT 'present'
                        CHECK(status IN ('present', 'absent', 'late', 'half_day')),
    notes           TEXT NOT NULL DEFAULT '',
    UNIQUE(user_id, date)
);

-- ============================================================
-- PAYROLL
-- ============================================================

CREATE TABLE IF NOT EXISTS payroll_payroll (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id     INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    basic_salary    DECIMAL(10, 2) NOT NULL,
    bonus           DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    deductions      DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    final_salary    DECIMAL(10, 2) NOT NULL,
    payment_date    DATE NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ASSETS
-- ============================================================

CREATE TABLE IF NOT EXISTS assets_asset (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_name      VARCHAR(100) NOT NULL,
    asset_id        VARCHAR(50) NOT NULL UNIQUE,
    assigned_to_id  INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'available'
                        CHECK(status IN ('available', 'assigned', 'repair')),
    purchase_date   DATE NOT NULL,
    image           VARCHAR(255)
);

-- ============================================================
-- DOCUMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS documents_document (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           VARCHAR(200) NOT NULL,
    file            VARCHAR(255) NOT NULL,
    uploaded_by_id  INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    uploaded_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- FEEDBACK
-- ============================================================

CREATE TABLE IF NOT EXISTS feedback_feedback (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    given_by_id     INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    given_to_id     INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    rating          INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comments        TEXT NOT NULL DEFAULT '',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications_notification (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_id    INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    message         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CERTIFICATES
-- ============================================================

CREATE TABLE IF NOT EXISTS certificates_certificate (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    intern_id       INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    issued_by_id    INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    title           VARCHAR(200) NOT NULL,
    issued_date     DATE NOT NULL,
    file            VARCHAR(255)
);

-- ============================================================
-- SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS settings_module_sitesettings (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    site_name                   VARCHAR(100) NOT NULL DEFAULT 'SIMS',
    contact_email               VARCHAR(254) NOT NULL DEFAULT '',
    max_interns                 INTEGER NOT NULL DEFAULT 50,
    internship_duration_months  INTEGER NOT NULL DEFAULT 6
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_attendance_user_date   ON attendance_attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to      ON tasks_task(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status           ON tasks_task(status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee       ON payroll_payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_date           ON payroll_payroll(payment_date);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications_notification(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_feedback_given_to      ON feedback_feedback(given_to_id);
CREATE INDEX IF NOT EXISTS idx_interns_status         ON interns_intern(status);
CREATE INDEX IF NOT EXISTS idx_assets_status          ON assets_asset(status);
