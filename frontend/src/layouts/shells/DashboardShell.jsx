import { useState } from 'react'
import { Menu, X, LogOut, Bell, ChevronRight, LayoutDashboard, Users, UserCheck, ClipboardList, CalendarCheck, Package, Wallet, User, Bot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import ErrorBoundary from '../../components/common/ErrorBoundary'
import { ADMIN_ROLES, MANAGER_ROLES, STAFF_ROLES } from '../../utils/permissions'

export default function DashboardShell({ title, navItems, defaultView, accentColor = 'bg-primary-900' }) {
  const [activeView, setActiveView] = useState(defaultView || navItems[0]?.key)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const role = user?.role || 'intern'
  
  const DASHBOARD_CONFIG = [
    { path: role === 'manager' ? '/manager' : '/admin', label: role === 'manager' ? 'Management Dashboard' : 'Full System Dashboard', icon: LayoutDashboard, roles: MANAGER_ROLES },
    { path: '/intern-mgmt', label: 'Intern Mgmt', icon: UserCheck, roles: ['admin', 'superadmin', 'manager', 'lead'] },
    { path: '/mentor', label: 'Mentoring Dashboard', icon: UserCheck, roles: ['mentor'] },
    { path: '/task', label: role === 'lead' ? 'Project & Task Dashboard' : 'Tasks', icon: ClipboardList, roles: ['admin', 'superadmin', 'manager', 'lead'] },
    { path: '/attendance', label: 'Attendance', icon: CalendarCheck, roles: ['admin', 'superadmin', 'manager', 'lead'] },
    { path: '/asset', label: 'Assets', icon: Package, roles: MANAGER_ROLES },
    { path: '/payroll', label: 'Payroll', icon: Wallet, roles: ADMIN_ROLES },
    { path: '/ai', label: 'AI Center', icon: Bot, roles: ['admin', 'superadmin', 'manager', 'lead', 'mentor'] },
    { path: '/intern-user', label: 'Self-Service Dashboard', icon: User, roles: ['intern'] },
  ]

  const userDashboards = DASHBOARD_CONFIG.filter(db => db.roles.includes(role))

  const handleLogout = async () => { await logout(); navigate('/login', { replace: true }) }
  const ActiveComponent = navItems.find(n => n.key === activeView)?.component
  const activeLabel = navItems.find(n => n.key === activeView)?.label

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} ${accentColor} text-white flex flex-col flex-shrink-0`}
        style={{ transition: 'width 0.25s ease' }}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 flex-shrink-0">
          {sidebarOpen && (
            <div>
              <span className="font-bold text-base tracking-wide">{title}</span>
              <p className="text-xs text-white/50 mt-0.5">SIMS</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(o => !o)} className="text-white/60 hover:text-white ml-auto p-1 rounded">
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              title={!sidebarOpen ? label : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative
                ${activeView === key
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`}
            >
              {activeView === key && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-white rounded-r" />
              )}
              <Icon size={17} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </button>
          ))}

          {/* Dashboard Switcher Section */}
          {userDashboards.length > 1 && (
            <div className="mt-6 border-t border-white/10 pt-4">
              {sidebarOpen ? (
                <div className="px-4 mb-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Dashboards</p>
                </div>
              ) : (
                <div className="w-full border-b border-white/10 my-2" />
              )}
              
              {userDashboards.map(({ path, label, icon: Icon }) => {
                const isActive = window.location.pathname.startsWith(path)
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    title={!sidebarOpen ? label : undefined}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-xs transition-colors relative
                      ${isActive
                        ? 'bg-white/15 text-white font-medium border-l-2 border-white'
                        : 'text-white/55 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    {sidebarOpen && <span className="truncate">{label}</span>}
                  </button>
                )
              })}
            </div>
          )}
        </nav>

        <div className="p-3 border-t border-white/10 flex-shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-2 px-1 mb-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.username}</p>
                <p className="text-xs text-white/50 capitalize">{user?.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm w-full px-1 py-1.5 rounded hover:bg-white/10"
          >
            <LogOut size={15} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{title}</span>
            <ChevronRight size={14} />
            <span>{activeLabel}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden md:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <button className="text-gray-400 hover:text-gray-600 p-1"><Bell size={18} /></button>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <ErrorBoundary>
            {ActiveComponent ? <ActiveComponent /> : <p className="text-gray-400">Select a view</p>}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
