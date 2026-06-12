import api from './api'

export const login = (data) => api.post('/auth/login/', data)
export const register = (data) => api.post('/auth/register/', data)
export const logout = (refresh) => api.post('/auth/logout/', { refresh })
export const getMe = () => api.get('/auth/me/')
export const refreshToken = (refresh) => api.post('/auth/token/refresh/', { refresh })
