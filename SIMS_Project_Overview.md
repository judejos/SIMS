# SIMS - Student Intern Management System
**Complete Project Overview & Documentation**

## 1. Project Stage: 100% Completed
Congratulations! All 5 major development phases of the SIMS architecture have been successfully completed, integrated, and deployed locally.

- **Phase 1:** Core Authentication & User Roles (Completed)
- **Phase 2:** Intern Management & Tracking (Completed)
- **Phase 3:** Attendance, Leaves, and Tasks (Completed)
- **Phase 4:** Assets, Documents, Payroll & Performance (Completed)
- **Phase 5:** AI Intelligence Layer (Completed)

---

## 2. User Roles & Permissions
The system uses a strict hierarchical Role-Based Access Control (RBAC) system.

| Role | Access Level | Primary Responsibilities & Work |
| :--- | :--- | :--- |
| **Super Admin** | Ultimate | Total system control. Manages system settings, permissions, organization structure, and top-level analytics. |
| **Admin** | High | Oversees operations. Handles Payroll, Registering Staff, Asset Management, and global approvals. |
| **Manager** | High | Oversees Departments & Teams. Reviews overarching project progress, generates reports, and monitors team feedback. |
| **Lead / SME** | Medium | Domain Experts. Creates projects, assigns technical tasks to interns, reviews document submissions, and evaluates task performance. |
| **Mentor** | Medium | Direct Supervisors. Approves daily attendance, grants leave requests, monitors daily intern progress, and provides personal guidance. |
| **Intern** | Self-Service | End-Users. Submits daily tasks, clocks in/out for attendance, requests leaves, uploads documents, and interacts with the AI. |

---

## 3. The Dashboards (A to Z)
The system is divided into modular "Shells" to prevent clutter, ensuring users only see what is relevant to their specific role.

### 🏢 Full System / Management Dashboard
*Accessed by: Super Admin, Admin, Manager*
- **Purpose:** The birds-eye view of the entire organization.
- **Features:** Global metrics, active user counts, payroll charts, attendance pie charts, and quick actions to manage departments and teams.

### 👥 Intern Management Dashboard
*Accessed by: Admins, Managers, Leads, Mentors*
- **Purpose:** Central hub for HR and Mentors to manage the intern lifecycle.
- **Features:** Table of all interns, profile viewing, performance history, status toggling (Active/Terminated), and onboarding tools.

### 📋 Project & Task Dashboard
*Accessed by: Leads, SMEs, Mentors, Admins*
- **Purpose:** Kanban-style workflow management.
- **Features:** Drag-and-drop task boards. Leads create tasks and assign them to interns. Mentors verify submitted tasks and leave feedback ratings.

### ⏱️ Attendance Dashboard
*Accessed by: Mentors, Admins, Managers*
- **Purpose:** Track time and presence.
- **Features:** View daily logs, approve or reject leave requests, and monitor late arrivals.

### 💻 Asset & Document Dashboard
*Accessed by: Admins, Managers*
- **Purpose:** Inventory and compliance tracking.
- **Features:** Track laptops/monitors assigned to interns. Review NDA documents, ID proofs, and certificates uploaded by interns.

### 💰 Payroll Dashboard
*Accessed by: Super Admin, Admin*
- **Purpose:** Financial processing.
- **Features:** Process monthly stipends, view transaction history, and generate financial exports based on intern attendance and performance.

### 🧑‍💻 Intern Self-Service Dashboard
*Accessed by: Interns*
- **Purpose:** The daily workspace for an intern.
- **Features:** Clock-in/out button, active task list, leave request form, document upload center, and personal performance charts.

### 🤖 AI Center (The Intelligence Layer)
*Accessed by: Everyone (Features vary by role)*
- **AI Chatbot:** An intelligent assistant that can answer questions about system navigation and company policies.
- **Mock Interview:** A voice-enabled AI interviewer that asks technical questions, listens to the intern's voice, and provides instant scoring and feedback.
- **Resume Evaluator:** An AI tool where interns upload their PDF/Word resumes to receive actionable, professional improvement suggestions.

---

## 4. Technical Architecture
- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6.
- **Backend:** Python, Django REST Framework, PostgreSQL (or SQLite locally), SimpleJWT Auth.
- **AI Integration:** Google Gemini API integration using native Prompts and native Browser Speech Recognition (Voice-to-Text).
