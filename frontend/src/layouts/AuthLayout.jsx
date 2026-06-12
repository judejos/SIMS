import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function AuthLayout() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) {
    if (user.role === 'intern') return <Navigate to="/intern-user" replace />
    return <Navigate to="/admin" replace />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-600 flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}
