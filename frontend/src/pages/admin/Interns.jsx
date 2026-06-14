import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, CheckCircle, Upload } from 'lucide-react'
import { getInterns, createIntern, updateIntern, deleteIntern } from '../../services/internsAPI'
import { getUsers } from '../../services/usersAPI'
import api from '../../services/api'
import Table from '../../components/tables/Table'
import Modal from '../../components/modals/Modal'
import ConfirmModal from '../../components/modals/ConfirmModal'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import useSearch from '../../hooks/useSearch'

export default function Interns() {
  const [interns, setInterns] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [approvingId, setApprovingId] = useState(null)
  
  const fileInputRef = useRef(null)
  const { register, handleSubmit, reset, setValue } = useForm()
  const { query, setQuery, filtered } = useSearch(interns, ['college', 'degree', 'status', 'domain', 'user__first_name', 'user__last_name'])

  const load = () => {
    setLoading(true)
    Promise.all([getInterns(), getUsers()])
      .then(([i, u]) => { setInterns(i.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); reset(); setModal(true) }
  const openEdit = (intern) => {
    setEditing(intern)
    setValue('college', intern.college)
    setValue('degree', intern.degree)
    setValue('start_date', intern.start_date)
    setValue('end_date', intern.end_date)
    setValue('status', intern.status)
    setModal(true)
  }

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateIntern(editing.id, data)
        toast.success('Intern updated!')
      } else {
        await createIntern(data)
        toast.success('Intern added!')
      }
      setModal(false); load()
    } catch { toast.error('Something went wrong') }
  }

  const executeDelete = async (id) => {
    try {
      await deleteIntern(id)
      toast.success('Deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  const executeApprove = async (id) => {
    try {
      await api.post(`/interns/${id}/approve/`)
      toast.success('Intern Onboarding Approved!')
      load()
    } catch { toast.error('Failed to approve') }
  }

  const getUserName = (id) => {
    const u = users.find(u => u.id === id)
    return u ? `${u.first_name} ${u.last_name} (${u.username})` : id
  }

  const columns = [
    { key: 'user', label: 'Intern', render: r => getUserName(r.user) },
    { key: 'college', label: 'College' },
    { key: 'degree', label: 'Degree' },
    { key: 'start_date', label: 'Start Date', render: r => r.start_date || '—' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    {
      key: 'actions', label: 'Actions', render: r => (
        <div className="flex gap-2">
          {r.status === 'pending' && (
            <button onClick={() => setApprovingId(r.id)} className="text-green-600 hover:text-green-800" title="Approve Onboarding"><CheckCircle size={15} /></button>
          )}
          <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700" title="Edit"><Pencil size={15} /></button>
          <button onClick={() => setDeletingId(r.id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={15} /></button>
        </div>
      )
    },
  ]

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/interns/bulk_import/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(res.data.message)
      if (res.data.errors && res.data.errors.length > 0) {
        console.warn('Import Errors:', res.data.errors)
        toast.error(`Imported with ${res.data.errors.length} errors. Check console.`)
      }
      load()
    } catch {
      toast.error('Failed to import interns')
    }
    e.target.value = ''
  }

  return (
    <div>
      <PageHeader 
        title="Interns" 
        subtitle={`${filtered.length} of ${interns.length} interns`} 
        action={
          <div className="flex gap-2">
            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} className="inline mr-1" /> Import CSV
            </Button>
            <Button onClick={openAdd}><Plus size={16} className="inline mr-1" />Add Intern</Button>
          </div>
        } 
      />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by college, degree, domain, status…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

      <ConfirmModal 
        open={!!deletingId} 
        onClose={() => setDeletingId(null)} 
        onConfirm={() => executeDelete(deletingId)}
        title="Delete Intern"
        message="Are you sure you want to delete this intern? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <ConfirmModal 
        open={!!approvingId} 
        onClose={() => setApprovingId(null)} 
        onConfirm={() => executeApprove(approvingId)}
        title="Approve Onboarding"
        message="Are you sure you want to approve this intern's onboarding and activate their account?"
        confirmText="Approve"
        variant="primary"
      />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Intern' : 'Add Intern'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <select {...register('user', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username} — {u.first_name} {u.last_name}</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
              <input {...register('college')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input {...register('degree')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" {...register('start_date', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" {...register('end_date')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select {...register('status')} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
