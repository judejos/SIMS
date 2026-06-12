import api from './api'

export const getNotifications = () => api.get('/notifications/')
export const markRead = (id) => api.patch(`/notifications/${id}/`, { is_read: true })
