import api from './api'

export const getUsers = () => api.get('/users/')
export const getUser = (id) => api.get(`/users/${id}/`)
export const updateUser = (id, data) => api.patch(`/users/${id}/`, data)
export const deleteUser = (id) => api.delete(`/users/${id}/`)
export const getProfiles = () => api.get('/users/profiles/')
export const updateProfile = (id, data) => api.patch(`/users/profiles/${id}/`, data)
