export const ADMIN_ROLES = ['superadmin', 'admin']
export const MANAGER_ROLES = ['superadmin', 'admin', 'manager']
export const STAFF_ROLES = ['superadmin', 'admin', 'manager', 'lead', 'sme', 'mentor']

export const canManageUsers = (role) => MANAGER_ROLES.includes(role)
export const canViewPayroll = (role) => MANAGER_ROLES.includes(role)
export const canCreateTask = (role) => ['mentor', 'lead', 'sme', ...MANAGER_ROLES].includes(role)
export const canVerifyTask = (role) => ['mentor', 'lead', 'sme', ...MANAGER_ROLES].includes(role)
export const canApproveDocs = (role) => ['lead', 'sme', ...MANAGER_ROLES].includes(role)
export const canApproveLeave = (role) => ['mentor', 'lead', 'sme', ...MANAGER_ROLES].includes(role)
export const canManageOrg = (role) => ADMIN_ROLES.includes(role)
export const isIntern = (role) => role === 'intern'
export const isStaffOrAbove = (role) => STAFF_ROLES.includes(role)
