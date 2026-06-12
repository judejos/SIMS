import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import useAuth from '../hooks/useAuth'
import ErrorBoundary from '../components/common/ErrorBoundary'
import NotFound from '../pages/NotFound'

function SmartRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'intern') return <Navigate to="/intern-user" replace />
  if (user.role === 'mentor') return <Navigate to="/task" replace />
  if (user.role === 'lead' || user.role === 'sme') return <Navigate to="/task" replace />
  if (user.role === 'staff') return <Navigate to="/task" replace />
  return <Navigate to="/admin" replace />
}

import AuthLayout from '../layouts/AuthLayout'
import AdminLayout from '../layouts/AdminLayout'
import InternLayout from '../layouts/InternLayout'

// Auth
import Login from '../pages/auth/Login'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import Interns from '../pages/admin/Interns'
import Departments from '../pages/admin/Departments'
import Payments from '../pages/admin/Payments'
import AdminTeams from '../pages/admin/Teams'
import Reports from '../pages/admin/Reports'
import Settings from '../pages/admin/Settings'
import PerformanceFeedbackPage from '../pages/admin/PerformanceFeedbackPage'
import RegisterPage from '../pages/admin/RegisterPage'
import AdminProfile from '../pages/admin/AdminProfile'

// Dashboard Shells
import TaskDashboardShell from '../pages/task-dashboard/TaskDashboardShell'
import AttendanceDashboardShell from '../pages/attendance-dashboard/AttendanceDashboardShell'
import AssetDashboardShell from '../pages/asset-dashboard/AssetDashboardShell'
import PayrollDashboardShell from '../pages/payroll-dashboard/PayrollDashboardShell'
import InternUserDashboardShell from '../pages/intern-user/InternUserDashboardShell'
import InternDashboardShell from '../pages/intern-dashboard/InternDashboardShell'

// Intern staff pages
import InternDashboard from '../pages/intern/Dashboard'
import InternTasks from '../pages/intern/Tasks'
import InternAttendance from '../pages/intern/Attendance'
import InternLeave from '../pages/intern/Leave'
import InternDocuments from '../pages/intern/Documents'
import InternPerformance from '../pages/intern/Performance'
import InternProfile from '../pages/intern/Profile'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin Dashboard Shell — /admin/* */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="interns" element={<Interns />} />
        <Route path="departments" element={<Departments />} />
        <Route path="payments" element={<Payments />} />
        <Route path="teams" element={<AdminTeams />} />
        <Route path="feedback" element={<PerformanceFeedbackPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Intern Management Dashboard — /intern-mgmt/* */}
      <Route path="/intern-mgmt/*" element={<ProtectedRoute><InternDashboardShell /></ProtectedRoute>} />

      {/* Intern Dashboard (staff) — /intern/* */}
      <Route path="/intern" element={<ProtectedRoute><InternLayout /></ProtectedRoute>}>
        <Route index element={<InternDashboard />} />
        <Route path="tasks" element={<InternTasks />} />
        <Route path="attendance" element={<InternAttendance />} />
        <Route path="leave" element={<InternLeave />} />
        <Route path="documents" element={<InternDocuments />} />
        <Route path="performance" element={<InternPerformance />} />
        <Route path="profile" element={<InternProfile />} />
      </Route>

      {/* Task Dashboard Shell — /task/* */}
      <Route path="/task/*" element={<ProtectedRoute><TaskDashboardShell /></ProtectedRoute>} />

      {/* Attendance Dashboard Shell — /attendance/* */}
      <Route path="/attendance/*" element={<ProtectedRoute><AttendanceDashboardShell /></ProtectedRoute>} />

      {/* Asset Dashboard Shell — /asset/* */}
      <Route path="/asset/*" element={<ProtectedRoute><AssetDashboardShell /></ProtectedRoute>} />

      {/* Payroll Dashboard Shell — /payroll/* */}
      <Route path="/payroll/*" element={<ProtectedRoute><PayrollDashboardShell /></ProtectedRoute>} />

      {/* Intern Self-Service — /intern-user/* */}
      <Route path="/intern-user/*" element={<ProtectedRoute><InternUserDashboardShell /></ProtectedRoute>} />

      {/* Smart home redirect based on role */}
      <Route path="/" element={<SmartRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
