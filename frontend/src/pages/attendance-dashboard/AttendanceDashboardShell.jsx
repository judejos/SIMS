import { LayoutDashboard, CalendarCheck, CalendarX, Clock, FileText } from 'lucide-react'
import DashboardShell from '../../layouts/shells/DashboardShell'
import AttendanceOverview from './views/AttendanceOverview'
import DailyAttendance from './views/DailyAttendance'
import LeaveManagement from './views/LeaveManagement'
import AttendanceReports from './views/AttendanceReports'

const navItems = [
  { key: 'overview',  label: 'Overview',          icon: LayoutDashboard, component: AttendanceOverview },
  { key: 'daily',     label: 'Daily Attendance',   icon: CalendarCheck,   component: DailyAttendance },
  { key: 'leave',     label: 'Leave Management',   icon: CalendarX,       component: LeaveManagement },
  { key: 'reports',   label: 'Reports',            icon: FileText,        component: AttendanceReports },
]

export default function AttendanceDashboardShell() {
  return <DashboardShell title="Attendance" navItems={navItems} accentColor="bg-teal-900" />
}
