import useAuth from './useAuth'

export default function usePermissions() {
  const { user } = useAuth()
  const role = user?.role || 'intern'
  return {
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isIntern: role === 'intern',
    role,
  }
}
