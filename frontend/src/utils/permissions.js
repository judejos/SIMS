export const ADMIN_ROLES = ['superadmin', 'admin']
export const MANAGER_ROLES = ['superadmin', 'admin', 'manager']
export const STAFF_ROLES = ['superadmin', 'admin', 'manager', 'lead', 'mentor']

// Admin is view-only (can see everything but cannot create/edit/delete except staff registration)
export const isAdminViewOnly = (role) => role === 'admin'
export const canWrite = (role) => role !== 'admin'  // everyone except admin can write

export const canManageUsers = (role) => MANAGER_ROLES.includes(role)
export const canAddStaff = (role) => ADMIN_ROLES.includes(role)
export const canViewPayroll = (role) => MANAGER_ROLES.includes(role)
export const canCreateTask = (role) => canWrite(role) && ['mentor', 'lead', ...MANAGER_ROLES].includes(role)
export const canVerifyTask = (role) => canWrite(role) && ['mentor', 'lead', ...MANAGER_ROLES].includes(role)
export const canApproveDocs = (role) => canWrite(role) && ['lead', ...MANAGER_ROLES].includes(role)
export const canApproveLeave = (role) => canWrite(role) && ['mentor', 'lead', ...MANAGER_ROLES].includes(role)
export const canManageOrg = (role) => ADMIN_ROLES.includes(role)
export const isIntern = (role) => role === 'intern'
export const isStaffOrAbove = (role) => STAFF_ROLES.includes(role)

