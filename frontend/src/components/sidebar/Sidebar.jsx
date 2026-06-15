import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCheck, Building2, CreditCard,
  UsersRound, BarChart3, Settings, CalendarCheck, ClipboardList,
  FolderKanban, Wallet, Package, FileText, MessageSquare, Bot,
  UserPlus, User, ChevronRight
} from 'lucide-react'
import { ADMIN_ROLES, MANAGER_ROLES, STAFF_ROLES } from '../../utils/permissions'

const getAdminLinks = (role) => {
  const base = role === 'manager' ? '/manager' : '/admin'
  const links = [
    { to: base, icon: LayoutDashboard, label: role === 'manager' ? 'Management Dashboard' : 'Full System Dashboard', roles: MANAGER_ROLES },
    { to: `${base}/users`, icon: Users, label: 'Staff', roles: MANAGER_ROLES },
    { to: `${base}/interns`, icon: UserCheck, label: 'Interns', roles: MANAGER_ROLES },
    { to: `${base}/departments`, icon: Building2, label: 'Departments', roles: MANAGER_ROLES },
    { to: `${base}/teams`, icon: UsersRound, label: 'Teams', roles: MANAGER_ROLES },
    { to: `${base}/payments`, icon: CreditCard, label: 'Payments', roles: ADMIN_ROLES },
    { to: `${base}/feedback`, icon: MessageSquare, label: 'Feedback', roles: MANAGER_ROLES },
    { to: `${base}/register`, icon: UserPlus, label: 'Register Staff', roles: ADMIN_ROLES },
    { to: `${base}/reports`, icon: BarChart3, label: 'Reports', roles: MANAGER_ROLES },
    { to: `${base}/settings`, icon: Settings, label: 'Settings', roles: ADMIN_ROLES },
    { to: `${base}/profile`, icon: User, label: 'My Profile', roles: MANAGER_ROLES },
  ]
  return links.filter(link => link.roles.includes(role))
}

const getInternLinks = (role) => [
  { to: '/intern-user', icon: LayoutDashboard, label: 'Self-Service Dashboard' },
  { to: '/intern-user', icon: CalendarCheck, label: 'Attendance' },
  { to: '/intern-user', icon: ClipboardList, label: 'Tasks' },
  { to: '/intern-user', icon: FileText, label: 'Documents' },
  { to: '/intern-user', icon: BarChart3, label: 'Performance' },
  { to: '/intern-user', icon: Bot, label: 'AI Center' },
  { to: '/intern-user', icon: User, label: 'Profile' },
]

const getDashboardLinks = (role) => [
  { to: role === 'manager' ? '/manager' : '/admin', icon: LayoutDashboard, label: role === 'manager' ? 'Management Dashboard' : 'Full System Dashboard', roles: MANAGER_ROLES },
  { to: '/intern-mgmt', icon: UserCheck, label: 'Intern Mgmt', roles: ['admin', 'superadmin', 'manager', 'lead'] },
  { to: '/mentor', icon: UserCheck, label: 'Mentoring Dashboard', roles: ['mentor'] },
  { to: '/task', icon: ClipboardList, label: role === 'lead' ? 'Project & Task Dashboard' : 'Tasks', roles: ['admin', 'superadmin', 'manager', 'lead'] },
  { to: '/attendance', icon: CalendarCheck, label: 'Attendance', roles: ['admin', 'superadmin', 'manager', 'lead'] },
  { to: '/asset', icon: Package, label: 'Assets', roles: MANAGER_ROLES },
  { to: '/payroll', icon: Wallet, label: 'Payroll', roles: ADMIN_ROLES },
  { to: '/ai', icon: Bot, label: 'AI Center', roles: ['admin', 'superadmin', 'manager', 'lead', 'mentor'] },
]

export default function Sidebar({ role }) {
  const isManagerOrAdmin = MANAGER_ROLES.includes(role)
  const isStaff = STAFF_ROLES.includes(role) && !isManagerOrAdmin
  const isIntern = role === 'intern'

  let primaryLinks = []
  if (isManagerOrAdmin) {
    primaryLinks = getAdminLinks(role)
  } else if (isIntern) {
    primaryLinks = getInternLinks(role)
  } else if (isStaff) {
    primaryLinks = getDashboardLinks(role).filter(link => link.roles.includes(role))
  }

  const otherDashboards = isManagerOrAdmin 
    ? getDashboardLinks(role).filter(link => !['/admin', '/manager'].includes(link.to) && link.roles.includes(role))
    : []

  const [isOtherOpen, setIsOtherOpen] = useState(true)

  return (
    <aside className="w-64 bg-primary-900 text-white flex flex-col flex-shrink-0 h-full">
      <div className="p-5 border-b border-primary-700">
        <h1 className="text-xl font-bold tracking-wide">SIMS</h1>
        <p className="text-xs text-primary-300 mt-0.5">Intern Management System</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {primaryLinks.map(({ to, icon: Icon, label }) => (
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

        {otherDashboards.length > 0 && (
          <>
            <button 
              onClick={() => setIsOtherOpen(!isOtherOpen)}
              className="w-full flex items-center justify-between px-5 pt-4 pb-2 text-left"
            >
              <p className="text-xs text-primary-400 uppercase tracking-wider font-medium">Other Dashboards</p>
              <ChevronRight size={14} className={`text-primary-400 transition-transform ${isOtherOpen ? 'rotate-90' : ''}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-200 ${isOtherOpen ? 'max-h-96' : 'max-h-0'}`}>
              {otherDashboards.map(({ to, icon: Icon, label }) => (
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
                  <Icon size={16} className="flex-shrink-0 opacity-70" />
                  {label}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>
    </aside>
  )
}
