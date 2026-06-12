import api from './api'

export const getAssets = () => api.get('/assets/')
export const createAsset = (data) => api.post('/assets/', data)
export const updateAsset = (id, data) => api.patch(`/assets/${id}/`, data)
export const deleteAsset = (id) => api.delete(`/assets/${id}/`)
