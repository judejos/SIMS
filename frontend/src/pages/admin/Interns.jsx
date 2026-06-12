import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getInterns, createIntern, updateIntern, deleteIntern } from '../../services/internsAPI'
import { getUsers } from '../../services/usersAPI'
import Table from '../../components/tables/Table'
import Modal from '../../components/modals/Modal'
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
  const { register, handleSubmit, reset, setValue } = useForm()
  const { query, setQuery, filtered } = useSearch(interns, ['college', 'degree', 'status', 'domain'])

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

  const onDelete = async (id) => {
    if (!confirm('Delete this intern?')) return
    await deleteIntern(id)
    toast.success('Deleted'); load()
  }

  const getUserName = (id) => {
    const u = users.find(u => u.id === id)
    return u ? `${u.first_name} ${u.last_name} (${u.username})` : id
  }

  const columns = [
    { key: 'user', label: 'Intern', render: r => getUserName(r.user) },
    { key: 'college', label: 'College' },
    { key: 'degree', label: 'Degree' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date', render: r => r.end_date || '—' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    {
      key: 'actions', label: 'Actions', render: r => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
          <button onClick={() => onDelete(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
        </div>
      )
    },
  ]

  return (
    <div>
      <PageHeader title="Interns" subtitle={`${filtered.length} of ${interns.length} interns`} action={<Button onClick={openAdd}><Plus size={16} className="inline mr-1" />Add Intern</Button>} />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by college, degree, domain, status…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

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
