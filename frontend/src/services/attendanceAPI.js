import api from './api'

export const getAttendance = () => api.get('/attendance/')
export const markAttendance = (data) => api.post('/attendance/', data)
export const updateAttendance = (id, data) => api.patch(`/attendance/${id}/`, data)

// Work Timer
export const timerToday    = ()  => api.get('/attendance/timer/today/')
export const timerStart    = ()  => api.post('/attendance/timer/start/')
export const timerPause    = ()  => api.post('/attendance/timer/pause/')
export const timerResume   = ()  => api.post('/attendance/timer/resume/')
export const timerCheckout = ()  => api.post('/attendance/timer/checkout/')
export const timerEndDay   = ()  => api.post('/attendance/timer/end_day/')
