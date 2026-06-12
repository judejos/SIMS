export const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const isPhone = (phone) => /^\d{10}$/.test(phone)
export const minLength = (str, len) => str.length >= len
