const ADMIN_ROLES = ['super_admin', 'admin']
const MANAGER_ROLES = ['super_admin', 'admin', 'manager']
const STAFF_ROLES = ['super_admin', 'admin', 'manager', 'lead', 'sme', 'mentor', 'staff']

export const canManageUsers = (role) => MANAGER_ROLES.includes(role)
export const canViewPayroll = (role) => ADMIN_ROLES.includes(role)
export const canCreateTask = (role) => MANAGER_ROLES.includes(role)
export const canVerifyTask = (role) => ['mentor', 'lead', ...MANAGER_ROLES].includes(role)
export const canApproveDocs = (role) => MANAGER_ROLES.includes(role)
export const canApproveLeave = (role) => ['mentor', ...MANAGER_ROLES].includes(role)
export const canManageOrg = (role) => ADMIN_ROLES.includes(role)
export const isIntern = (role) => role === 'intern'
export const isStaffOrAbove = (role) => STAFF_ROLES.includes(role)
