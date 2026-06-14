-- ============================================================
-- SIMS - Sample Data
-- Run after schema.sql
-- ============================================================

-- ============================================================
-- ============================================================
-- USERS (passwords are hashed — use Django createsuperuser for real)
-- Plain passwords for reference: All users use 'Vdart@123'
-- ============================================================

INSERT INTO auth_user (username, email, password, first_name, last_name, is_staff, is_active, is_superuser, date_joined)
VALUES
    ('Admin',       'admin@vdart.com',       'pbkdf2_sha256$...',  'System',   'Admin',    1, 1, 1, '2024-01-01 09:00:00'),
    ('Manager',     'manager@vdart.com',     'pbkdf2_sha256$...',  'General',  'Manager',  1, 1, 0, '2024-01-02 09:00:00'),
    ('Lead',        'lead@vdart.com',        'pbkdf2_sha256$...',  'Tech',     'Lead',     1, 1, 0, '2024-01-02 09:00:00'),
    ('SME',         'sme@vdart.com',         'pbkdf2_sha256$...',  'Subject',  'Expert',   1, 1, 0, '2024-01-10 09:00:00'),
    ('Mentor',      'mentor@vdart.com',      'pbkdf2_sha256$...',  'Training', 'Mentor',   1, 1, 0, '2024-01-10 09:00:00'),
    ('Staff',       'staff@vdart.com',       'pbkdf2_sha256$...',  'Ops',      'Staff',    1, 1, 0, '2024-01-15 09:00:00'),
    ('Intern',      'intern@vdart.com',      'pbkdf2_sha256$...',  'Dev',      'Intern',   1, 1, 0, '2024-01-15 09:00:00');

-- ============================================================
-- PROFILES
-- ============================================================

INSERT INTO users_profile (user_id, role, phone, department, joined_date)
VALUES
    (1, 'super_admin', '9000000001', 'Administration',       '2024-01-01'),
    (2, 'manager',     '9000000002', 'Management',           '2024-01-02'),
    (3, 'lead',        '9000000003', 'Engineering',          '2024-01-02'),
    (4, 'sme',         '9000000004', 'Subject Matter Experts','2024-01-10'),
    (5, 'mentor',      '9000000005', 'Training',             '2024-01-10'),
    (6, 'staff',       '9000000006', 'Operations',           '2024-01-15'),
    (7, 'intern',      '9000000007', 'Development',          '2024-01-15');

-- ============================================================
-- INTERNS
-- ============================================================

INSERT INTO interns_intern (user_id, mentor_id, college, degree, start_date, end_date, status)
VALUES
    (7, 5, 'Delhi University',  'BBA Marketing',            '2024-01-15', '2024-07-15', 'active');

-- ============================================================
-- TEAMS
-- ============================================================

INSERT INTO teams_team (name, lead_id, description, created_at)
VALUES
    ('Backend Team',    2, 'Handles all server-side development',   '2024-01-05 09:00:00'),
    ('Design Team',     3, 'UI/UX and product design',              '2024-01-05 09:00:00'),
    ('Full Stack Team', 2, 'End-to-end feature development',        '2024-01-20 09:00:00');

INSERT INTO teams_team_members (team_id, user_id)
VALUES
    (1, 4), (1, 6), (1, 8),
    (2, 5), (2, 7),
    (3, 4), (3, 5), (3, 6);

-- ============================================================
-- PROJECTS
-- ============================================================

INSERT INTO projects_project (name, description, manager_id, status, start_date, end_date, created_at)
VALUES
    ('SIMS Portal',         'Student Intern Management System web portal',  2, 'active',    '2024-01-10', '2024-06-30', '2024-01-10 09:00:00'),
    ('Mobile App',          'React Native mobile app for interns',          2, 'active',    '2024-02-01', '2024-07-31', '2024-02-01 09:00:00'),
    ('Design System',       'Component library and design guidelines',      3, 'active',    '2024-01-15', '2024-05-31', '2024-01-15 09:00:00'),
    ('Analytics Dashboard', 'Data visualization and reporting module',      2, 'on_hold',   '2024-03-01', '2024-08-31', '2024-03-01 09:00:00');

INSERT INTO projects_project_members (project_id, user_id)
VALUES
    (1, 4), (1, 6), (1, 8),
    (2, 4), (2, 6),
    (3, 5), (3, 7),
    (4, 6), (4, 8);

-- ============================================================
-- TASKS
-- ============================================================

INSERT INTO tasks_task (title, description, assigned_to_id, assigned_by_id, priority, status, due_date, created_at)
VALUES
    ('Setup Django REST API',           'Configure DRF and JWT authentication',         4, 2, 'high',   'completed',    '2024-01-20', '2024-01-10 09:00:00'),
    ('Design Login Page',               'Create Figma mockups for login screen',        5, 3, 'high',   'completed',    '2024-01-18', '2024-01-10 09:00:00'),
    ('Implement Attendance Module',     'Build attendance tracking API endpoints',      6, 2, 'high',   'in_progress',  '2024-02-15', '2024-01-20 09:00:00'),
    ('Create User Dashboard UI',        'React components for user dashboard',          4, 2, 'medium', 'in_progress',  '2024-02-20', '2024-01-25 09:00:00'),
    ('Write API Documentation',         'Document all REST API endpoints',              6, 2, 'medium', 'pending',      '2024-03-01', '2024-02-01 09:00:00'),
    ('Design Asset Management UI',      'Figma designs for asset tracking module',      5, 3, 'medium', 'in_progress',  '2024-02-25', '2024-02-01 09:00:00'),
    ('Implement Payroll Module',        'Build payroll calculation and API',            8, 2, 'high',   'pending',      '2024-03-10', '2024-02-05 09:00:00'),
    ('Setup CI/CD Pipeline',            'Configure GitHub Actions for deployment',      6, 2, 'low',    'pending',      '2024-03-15', '2024-02-10 09:00:00'),
    ('Marketing Landing Page',          'Design and build marketing landing page',      7, 3, 'medium', 'in_progress',  '2024-02-28', '2024-02-01 09:00:00'),
    ('Unit Tests for Auth Module',      'Write pytest tests for authentication',        4, 2, 'medium', 'completed',    '2024-02-10', '2024-01-28 09:00:00');

-- ============================================================
-- ATTENDANCE
-- ============================================================

INSERT INTO attendance_attendance (user_id, date, check_in, check_out, status, notes)
VALUES
    (4, '2024-02-01', '09:05', '18:00', 'present',  ''),
    (4, '2024-02-02', '09:30', '18:00', 'late',     'Traffic delay'),
    (4, '2024-02-05', '09:00', '18:00', 'present',  ''),
    (4, '2024-02-06', NULL,    NULL,    'absent',   'Sick leave'),
    (4, '2024-02-07', '09:00', '18:00', 'present',  ''),
    (5, '2024-02-01', '09:00', '18:00', 'present',  ''),
    (5, '2024-02-02', '09:00', '18:00', 'present',  ''),
    (5, '2024-02-05', '09:15', '18:00', 'late',     ''),
    (5, '2024-02-06', '09:00', '18:00', 'present',  ''),
    (5, '2024-02-07', '09:00', '13:00', 'half_day', 'Personal work'),
    (6, '2024-02-01', '09:00', '18:00', 'present',  ''),
    (6, '2024-02-02', '09:00', '18:00', 'present',  ''),
    (6, '2024-02-05', '09:00', '18:00', 'present',  ''),
    (6, '2024-02-06', '09:00', '18:00', 'present',  ''),
    (6, '2024-02-07', NULL,    NULL,    'absent',   'Medical appointment'),
    (8, '2024-02-05', '09:00', '18:00', 'present',  ''),
    (8, '2024-02-06', '09:00', '18:00', 'present',  ''),
    (8, '2024-02-07', '09:00', '18:00', 'present',  '');

-- ============================================================
-- PAYROLL
-- ============================================================

INSERT INTO payroll_payroll (employee_id, basic_salary, bonus, deductions, final_salary, payment_date, created_at)
VALUES
    (4, 15000.00, 1000.00, 500.00,  15500.00, '2024-01-31', '2024-01-31 18:00:00'),
    (5, 12000.00, 500.00,  300.00,  12200.00, '2024-01-31', '2024-01-31 18:00:00'),
    (6, 15000.00, 800.00,  500.00,  15300.00, '2024-01-31', '2024-01-31 18:00:00'),
    (7, 10000.00, 0.00,    200.00,  9800.00,  '2024-01-31', '2024-01-31 18:00:00'),
    (8, 15000.00, 1500.00, 500.00,  16000.00, '2024-01-31', '2024-01-31 18:00:00'),
    (4, 15000.00, 1000.00, 500.00,  15500.00, '2024-02-29', '2024-02-29 18:00:00'),
    (5, 12000.00, 500.00,  300.00,  12200.00, '2024-02-29', '2024-02-29 18:00:00'),
    (6, 15000.00, 800.00,  500.00,  15300.00, '2024-02-29', '2024-02-29 18:00:00');

-- ============================================================
-- ASSETS
-- ============================================================

INSERT INTO assets_asset (asset_name, asset_id, assigned_to_id, status, purchase_date)
VALUES
    ('MacBook Pro 14"',     'ASSET-001', 4, 'assigned',  '2023-06-01'),
    ('Dell Monitor 27"',    'ASSET-002', 4, 'assigned',  '2023-06-01'),
    ('MacBook Air M2',      'ASSET-003', 5, 'assigned',  '2023-08-15'),
    ('iPad Pro',            'ASSET-004', 5, 'assigned',  '2023-08-15'),
    ('ThinkPad X1 Carbon',  'ASSET-005', 6, 'assigned',  '2023-09-01'),
    ('Dell Laptop',         'ASSET-006', NULL, 'available', '2023-10-01'),
    ('HP Monitor',          'ASSET-007', NULL, 'available', '2023-10-01'),
    ('Mechanical Keyboard', 'ASSET-008', NULL, 'repair',    '2022-01-01');

-- ============================================================
-- DOCUMENTS
-- ============================================================

INSERT INTO documents_document (title, file, uploaded_by_id, uploaded_at)
VALUES
    ('Internship Agreement - Arjun',    'documents/agreement_arjun.pdf',    1, '2024-01-10 10:00:00'),
    ('Internship Agreement - Sneha',    'documents/agreement_sneha.pdf',    1, '2024-01-10 10:00:00'),
    ('NDA - Karan Singh',               'documents/nda_karan.pdf',          1, '2024-01-15 10:00:00'),
    ('Project Proposal - SIMS Portal',  'documents/proposal_sims.pdf',      2, '2024-01-12 10:00:00'),
    ('Onboarding Guide',                'documents/onboarding_guide.pdf',   1, '2024-01-05 10:00:00');

-- ============================================================
-- FEEDBACK
-- ============================================================

INSERT INTO feedback_feedback (given_by_id, given_to_id, rating, comments, created_at)
VALUES
    (2, 4, 5, 'Excellent work on the API setup. Very proactive.',                   '2024-02-01 10:00:00'),
    (2, 6, 4, 'Good progress on attendance module. Needs better documentation.',    '2024-02-01 10:00:00'),
    (3, 5, 5, 'Outstanding design work. Creative and on-time delivery.',            '2024-02-01 10:00:00'),
    (3, 7, 3, 'Decent work but needs to improve communication skills.',             '2024-02-01 10:00:00'),
    (2, 8, 4, 'Good start. Keep up the momentum on the payroll module.',            '2024-02-05 10:00:00');

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

INSERT INTO notifications_notification (recipient_id, message, is_read, created_at)
VALUES
    (4, 'Your task "Setup Django REST API" has been marked as completed.',  1, '2024-01-21 09:00:00'),
    (4, 'New task assigned: Create User Dashboard UI',                      0, '2024-01-25 09:00:00'),
    (5, 'Feedback received from your manager.',                             0, '2024-02-01 10:00:00'),
    (6, 'Reminder: Task "Implement Attendance Module" is due in 3 days.',   0, '2024-02-12 09:00:00'),
    (8, 'Welcome to SIMS! Your onboarding is complete.',                    1, '2024-02-01 09:00:00'),
    (7, 'Your attendance for Feb 7 has been marked as half day.',           0, '2024-02-07 14:00:00');

-- ============================================================
-- CERTIFICATES
-- ============================================================

INSERT INTO certificates_certificate (intern_id, issued_by_id, title, issued_date)
VALUES
    (4, 1, 'Completion Certificate - Backend Development',  '2024-07-10'),
    (5, 1, 'Completion Certificate - UI/UX Design',         '2024-07-10');

-- ============================================================
-- SITE SETTINGS
-- ============================================================

INSERT INTO settings_module_sitesettings (site_name, contact_email, max_interns, internship_duration_months)
VALUES ('SIMS', 'admin@sims.com', 50, 6);
