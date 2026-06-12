import { createContext, useState, useEffect } from 'react'
import { login as loginAPI, logout as logoutAPI } from '../services/authAPI'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('access')
    if (stored && token) {
      setUser(JSON.parse(stored))
      // Refresh user data from /me/ in background
      api.get('/auth/me/').then(r => {
        const fresh = r.data
        localStorage.setItem('user', JSON.stringify(fresh))
        setUser(fresh)
      }).catch(() => {}).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const { data } = await loginAPI(credentials)
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  const logout = async () => {
    try {
      await logoutAPI(localStorage.getItem('refresh'))
    } catch {}
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
