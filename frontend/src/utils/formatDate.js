export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

export const formatDateTime = (date) =>
  date ? new Date(date).toLocaleString() : '—'
