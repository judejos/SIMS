import { LayoutDashboard, Users, FileText, MessageSquare, ClipboardCheck, CheckSquare, FormInput } from 'lucide-react'
import DashboardShell from '../../layouts/shells/DashboardShell'
import InternMgmtDashboard from './views/InternMgmtDashboard'
import InternUsers from './views/InternUsers'
import InternDocuments from './views/InternDocuments'
import InternFeedbacks from './views/InternFeedbacks'
import InternForms from './views/InternForms'
import ApprovalDashboard from './views/ApprovalDashboard'
import CompletionList from './views/CompletionList'

const navItems = [
  { key: 'dashboard',   label: 'Dashboard',           icon: LayoutDashboard, component: InternMgmtDashboard },
  { key: 'users',       label: 'Interns',              icon: Users,           component: InternUsers },
  { key: 'documents',   label: 'Documents',            icon: FileText,        component: InternDocuments },
  { key: 'feedbacks',   label: 'Feedbacks',            icon: MessageSquare,   component: InternFeedbacks },
  { key: 'forms',       label: 'Forms',                icon: FormInput,       component: InternForms },
  { key: 'approvals',   label: 'Intern Approval',     icon: ClipboardCheck,  component: ApprovalDashboard },
  { key: 'completion',  label: 'Completion List',      icon: CheckSquare,     component: CompletionList },
]

export default function InternDashboardShell() {
  return <DashboardShell title="Intern Mgmt" navItems={navItems} accentColor="bg-cyan-900" />
}
