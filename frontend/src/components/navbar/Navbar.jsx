import { useState, useEffect } from 'react'
import { Bell, LogOut, User, ChevronDown } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { getNotifications, markRead } from '../../services/notificationAPI'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser] = useState(false)

  useEffect(() => {
    getNotifications()
      .then(r => setNotifications(r.data.filter(n => !n.is_read).slice(0, 5)))
      .catch(() => {})
  }, [])

  const handleLogout = async () => { await logout(); navigate('/login') }

  const handleMarkRead = async (id) => {
    await markRead(id)
    setNotifications(n => n.filter(x => x.id !== id))
  }

  const unread = notifications.length

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between relative z-30">
      <h2 className="text-base font-semibold text-gray-700">
        Welcome back, <span className="text-primary-600">{user?.first_name || user?.username}</span>
      </h2>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotif(s => !s); setShowUser(false) }} className="relative text-gray-500 hover:text-primary-600 p-1">
            <Bell size={20} />
            {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unread}</span>}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-9 w-80 bg-white rounded-xl shadow-xl border z-50">
              <div className="px-4 py-3 border-b font-semibold text-gray-700 text-sm">Notifications</div>
              {notifications.length === 0
                ? <p className="px-4 py-3 text-sm text-gray-400">No new notifications</p>
                : notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 border-b last:border-0 hover:bg-gray-50 flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700 flex-1">{n.message}</p>
                    <button onClick={() => handleMarkRead(n.id)} className="text-xs text-primary-600 hover:underline flex-shrink-0">Done</button>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button onClick={() => { setShowUser(s => !s); setShowNotif(false) }} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
            <ChevronDown size={14} />
          </button>
          {showUser && (
            <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
