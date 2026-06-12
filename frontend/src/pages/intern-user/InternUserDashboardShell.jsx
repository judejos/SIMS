import {
  LayoutDashboard, CalendarCheck, FileText, CreditCard, Package,
  BarChart2, CalendarX, ClipboardList, Clock, MessageSquare,
  Users, Mic, FileEdit, BookOpen, Bot, User
} from 'lucide-react'
import DashboardShell from '../../layouts/shells/DashboardShell'
import MyDashboard from './views/MyDashboard'
import MyAttendance from './views/MyAttendance'
import MyDocuments from './views/MyDocuments'
import PaymentStatus from './views/PaymentStatus'
import AssetReport from './views/AssetReport'
import MyPerformance from './views/MyPerformance'
import LeaveManagement from './views/LeaveManagement'
import MyTasks from './views/MyTasks'
import InternHoursCalculator from './views/InternHoursCalculator'
import StaffFeedback from './views/StaffFeedback'
import TeamsManagement from './views/TeamsManagement'
import MockInterviewPage from './views/MockInterviewPage'
import ResumeBuilderPage from './views/ResumeBuilderPage'
import MyLearningPath from './views/MyLearningPath'
import AIChatbot from './views/AIChatbot'
import MyProfile from './views/MyProfile'

const navItems = [
  { key: 'dashboard',   label: 'Dashboard',         icon: LayoutDashboard, component: MyDashboard },
  { key: 'attendance',  label: 'Attendance',         icon: CalendarCheck,   component: MyAttendance },
  { key: 'documents',   label: 'Documents',          icon: FileText,        component: MyDocuments },
  { key: 'payment',     label: 'Payment Status',     icon: CreditCard,      component: PaymentStatus },
  { key: 'assets',      label: 'Asset Report',       icon: Package,         component: AssetReport },
  { key: 'performance', label: 'Performance',        icon: BarChart2,       component: MyPerformance },
  { key: 'leave',       label: 'Leave',              icon: CalendarX,       component: LeaveManagement },
  { key: 'tasks',       label: 'Tasks',              icon: ClipboardList,   component: MyTasks },
  { key: 'hours',       label: 'Hours Calculator',   icon: Clock,           component: InternHoursCalculator },
  { key: 'feedback',    label: 'Staff Feedback',     icon: MessageSquare,   component: StaffFeedback },
  { key: 'teams',       label: 'Teams',              icon: Users,           component: TeamsManagement },
  { key: 'interview',   label: 'Mock Interview',     icon: Mic,             component: MockInterviewPage },
  { key: 'resume',      label: 'Resume Builder',     icon: FileEdit,        component: ResumeBuilderPage },
  { key: 'learning',    label: 'Learning Path',      icon: BookOpen,        component: MyLearningPath },
  { key: 'ai',          label: 'AI Assistant',       icon: Bot,             component: AIChatbot },
  { key: 'profile',     label: 'My Profile',         icon: User,            component: MyProfile },
]

export default function InternUserDashboardShell() {
  return <DashboardShell title="My Portal" navItems={navItems} accentColor="bg-violet-900" />
}
