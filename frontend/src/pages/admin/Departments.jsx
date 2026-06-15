import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'
import api from '../../services/api'
import Table from '../../components/tables/Table'
import Modal from '../../components/modals/Modal'
import ConfirmModal from '../../components/modals/ConfirmModal'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import useSearch from '../../hooks/useSearch'
import useAuth from '../../hooks/useAuth'
import { canWrite } from '../../utils/permissions'

export default function Departments() {
  const { user: me } = useAuth()
  const writable = canWrite(me?.role)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const { register, handleSubmit, reset, setValue } = useForm()
  const { query, setQuery, filtered } = useSearch(departments, ['name'])

  const load = () => {
    setLoading(true)
    api.get('/settings/departments/').then(r => setDepartments(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); reset(); setModal(true) }
  const openEdit = (d) => { setEditing(d); setValue('name', d.name); setModal(true) }

  const onSubmit = async ({ name }) => {
    try {
      editing
        ? await api.patch(`/settings/departments/${editing.id}/`, { name })
        : await api.post('/settings/departments/', { name })
      toast.success(editing ? 'Department updated!' : 'Department added!')
      setModal(false); load()
    } catch { toast.error('Failed to save') }
  }

  const executeDelete = async (id) => {
    try {
      await api.delete(`/settings/departments/${id}/`)
      toast.success('Deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  const columns = [
    {
      key: 'icon', label: '', render: () => (
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Building2 size={15} className="text-blue-500" />
        </div>
      )
    },
    { key: 'name', label: 'Department Name' },
    { key: 'id', label: 'ID', render: r => <span className="text-xs text-gray-400">#{r.id}</span> },
    ...(writable ? [{
      key: 'actions', label: '', render: r => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
          <button onClick={() => setDeletingId(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
        </div>
      )
    }] : []),
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Departments"
        subtitle={`${filtered.length} of ${departments.length} departments`}
        action={writable ? <Button onClick={openAdd}><Plus size={15} className="inline mr-1" />Add Department</Button> : null}
      />

      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search departments…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} emptyTitle="No departments yet" />
      </div>

      <ConfirmModal 
        open={!!deletingId} 
        onClose={() => setDeletingId(null)} 
        onConfirm={() => executeDelete(deletingId)}
        title="Delete Department"
        message="Are you sure you want to delete this department? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
            <input
              {...register('name', { required: true })}
              placeholder="e.g. Computer Science"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
