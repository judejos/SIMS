import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCheck, Building2, CreditCard,
  UsersRound, BarChart3, Settings, CalendarCheck, ClipboardList,
  FolderKanban, Wallet, Package, FileText, MessageSquare, Bot,
  UserPlus, User, ChevronRight
} from 'lucide-react'

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Staff' },
  { to: '/admin/interns', icon: UserCheck, label: 'Interns' },
  { to: '/admin/departments', icon: Building2, label: 'Departments' },
  { to: '/admin/teams', icon: UsersRound, label: 'Teams' },
  { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { to: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
  { to: '/admin/register', icon: UserPlus, label: 'Register Staff' },
  { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
  { to: '/admin/profile', icon: User, label: 'My Profile' },
]

const internLinks = [
  { to: '/intern-user', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/intern-user', icon: CalendarCheck, label: 'Attendance' },
  { to: '/intern-user', icon: ClipboardList, label: 'Tasks' },
  { to: '/intern-user', icon: FileText, label: 'Documents' },
  { to: '/intern-user', icon: BarChart3, label: 'Performance' },
  { to: '/intern-user', icon: User, label: 'Profile' },
]

const GROUP_LINKS = [
  { label: 'Dashboards', links: [
    { to: '/admin', icon: LayoutDashboard, label: 'Admin' },
    { to: '/intern-mgmt', icon: UserCheck, label: 'Intern Mgmt' },
    { to: '/task', icon: ClipboardList, label: 'Tasks' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/asset', icon: Package, label: 'Assets' },
    { to: '/payroll', icon: Wallet, label: 'Payroll' },
  ]},
]

export default function Sidebar({ role }) {
  const links = role === 'admin' ? adminLinks : internLinks

  return (
    <aside className="w-64 bg-primary-900 text-white flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-primary-700">
        <h1 className="text-xl font-bold tracking-wide">SIMS</h1>
        <p className="text-xs text-primary-300 mt-0.5">Intern Management System</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to + label}
            to={to}
            end={to === '/admin' || to === '/intern-user'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-primary-700 text-white font-medium border-r-2 border-white'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`
            }
          >
            <Icon size={17} className="flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        {role === 'admin' && (
          <>
            <div className="px-5 pt-4 pb-1">
              <p className="text-xs text-primary-400 uppercase tracking-wider font-medium">Other Dashboards</p>
            </div>
            {GROUP_LINKS[0].links.slice(1).map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-primary-700 text-white font-medium'
                      : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                  }`
                }
              >
                <Icon size={16} className="flex-shrink-0" />
                {label}
                <ChevronRight size={12} className="ml-auto opacity-50" />
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}
