import api from './api'

export const getPayrolls    = ()         => api.get('/payroll/')
export const createPayroll  = (data)     => api.post('/payroll/', data)
export const updatePayroll  = (id, data) => api.patch(`/payroll/${id}/`, data)
export const deletePayroll  = (id)       => api.delete(`/payroll/${id}/`)

// Intern Fee Payments
export const getInternPayments    = (params) => api.get('/payroll/intern-payments/', { params })
export const createInternPayment  = (data)   => api.post('/payroll/intern-payments/', data)
export const updateInternPayment  = (id, data) => api.patch(`/payroll/intern-payments/${id}/`, data)
export const deleteInternPayment  = (id)     => api.delete(`/payroll/intern-payments/${id}/`)
export const getInternPaymentSummary = ()    => api.get('/payroll/intern-payments/summary/')
