import { createContext, useState, useEffect } from 'react'
import { login as loginAPI, logout as logoutAPI } from '../services/authAPI'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    const token = sessionStorage.getItem('access')
    if (stored && token) {
      setUser(JSON.parse(stored))
      // Refresh user data from /me/ in background
      api.get('/auth/me/').then(r => {
        const fresh = r.data
        sessionStorage.setItem('user', JSON.stringify(fresh))
        setUser(fresh)
      }).catch(() => {}).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const { data } = await loginAPI(credentials)
    sessionStorage.setItem('access', data.access)
    sessionStorage.setItem('refresh', data.refresh)
    sessionStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  const logout = async () => {
    try {
      await logoutAPI(sessionStorage.getItem('refresh'))
    } catch {}
    sessionStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
