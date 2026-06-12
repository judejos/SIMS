import api from './api'

export const getInternInsights = (userId) => api.get(`/ai/insights/${userId}/`)
