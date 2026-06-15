import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getUsers, updateUser, deleteUser } from '../../services/usersAPI'
import { Trash2, Pencil, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/common/SearchBar'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Modal from '../../components/modals/Modal'
import ConfirmModal from '../../components/modals/ConfirmModal'
import useSearch from '../../hooks/useSearch'
import useAuth from '../../hooks/useAuth'
import { canManageUsers } from '../../utils/permissions'

export default function Users() {
  const navigate = useNavigate()
  const { user: me } = useAuth()
  const writable = canManageUsers(me?.role)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  
  const { register, handleSubmit, setValue } = useForm()
  const { query, setQuery, filtered } = useSearch(users, ['username', 'email', 'first_name', 'last_name'])

  const load = () => {
    setLoading(true)
    getUsers().then(r => setUsers(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openEdit = (u) => {
    setEditing(u)
    setValue('first_name', u.first_name)
    setValue('last_name', u.last_name)
    setValue('email', u.email)
    setModal(true)
  }

  const onSubmit = async (data) => {
    try {
      await updateUser(editing.id, data)
      toast.success('User updated successfully')
      setModal(false)
      load()
    } catch (e) {
      toast.error('Failed to update user')
    }
  }

  const executeDelete = async (id) => {
    try {
      await deleteUser(id)
      toast.success('User deleted successfully')
      load()
    } catch (e) {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Users" 
        subtitle={`${filtered.length} of ${users.length} users`} 
        action={writable ? <Button onClick={() => navigate('/admin/register')}><UserPlus size={16} className="inline mr-1" />Add Staff</Button> : null}
      />
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name, email, username…" className="max-w-sm" />
        </div>
        {loading ? <p className="p-6 text-gray-500">Loading...</p> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Name</th>
                {writable && <th className="px-6 py-3 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No users match your search.</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{u.username}</td>
                  <td className="px-6 py-3 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3">{u.first_name} {u.last_name}</td>
                  {writable && <td className="px-6 py-3 flex gap-2">
                    <button onClick={() => openEdit(u)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                    <button onClick={() => setDeletingId(u.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal 
        open={!!deletingId} 
        onClose={() => setDeletingId(null)} 
        onConfirm={() => executeDelete(deletingId)}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and will remove their access to the system."
        confirmText="Delete"
        variant="danger"
      />

      <Modal open={modal} onClose={() => setModal(false)} title="Edit User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input {...register('first_name')} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input {...register('last_name')} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" {...register('email')} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">Update User</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
