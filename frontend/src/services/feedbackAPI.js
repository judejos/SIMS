import api from './api'

export const getFeedbacks = () => api.get('/feedback/')
export const createFeedback = (data) => api.post('/feedback/', data)
export const deleteFeedback = (id) => api.delete(`/feedback/${id}/`)
