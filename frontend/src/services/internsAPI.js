import api from './api'

export const getInterns = () => api.get('/interns/')
export const getIntern = (id) => api.get(`/interns/${id}/`)
export const createIntern = (data) => api.post('/interns/', data)
export const updateIntern = (id, data) => api.patch(`/interns/${id}/`, data)
export const deleteIntern = (id) => api.delete(`/interns/${id}/`)
