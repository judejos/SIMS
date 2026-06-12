import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import api from '../../services/api'
import { getUsers } from '../../services/usersAPI'
import Table from '../../components/tables/Table'
import Modal from '../../components/modals/Modal'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import useSearch from '../../hooks/useSearch'

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset, setValue } = useForm()
  const { query, setQuery, filtered } = useSearch(teams, ['name', 'description'])

  const load = () => {
    setLoading(true)
    Promise.all([api.get('/teams/'), getUsers()])
      .then(([t, u]) => { setTeams(t.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); reset(); setModal(true) }
  const openEdit = (t) => {
    setEditing(t)
    setValue('name', t.name)
    setValue('description', t.description)
    setValue('lead', t.lead)
    setModal(true)
  }

  const onSubmit = async (data) => {
    try {
      editing
        ? await api.patch(`/teams/${editing.id}/`, data)
        : await api.post('/teams/', data)
      toast.success(editing ? 'Team updated!' : 'Team created!')
      setModal(false); load()
    } catch { toast.error('Failed to save') }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this team?')) return
    await api.delete(`/teams/${id}/`)
    toast.success('Deleted'); load()
  }

  const getLeadName = (id) => {
    const u = users.find(u => u.id === id)
    return u ? `${u.first_name} ${u.last_name}`.trim() || u.username : '—'
  }

  const columns = [
    {
      key: 'icon', label: '', render: () => (
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Users size={15} className="text-indigo-500" />
        </div>
      )
    },
    { key: 'name', label: 'Team Name', render: r => <span className="font-medium text-gray-800">{r.name}</span> },
    { key: 'description', label: 'Description', render: r => r.description || '—' },
    { key: 'lead', label: 'Team Lead', render: r => getLeadName(r.lead) },
    { key: 'members', label: 'Members', render: r => <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{r.members?.length ?? 0} members</span> },
    { key: 'created_at', label: 'Created', render: r => r.created_at?.slice(0, 10) },
    {
      key: 'actions', label: '', render: r => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
          <button onClick={() => onDelete(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Teams"
        subtitle={`${filtered.length} of ${teams.length} teams`}
        action={<Button onClick={openAdd}><Plus size={15} className="inline mr-1" />Add Team</Button>}
      />

      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by team name or description…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} emptyTitle="No teams yet" />
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Team' : 'Add Team'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
            <input
              {...register('name', { required: true })}
              placeholder="e.g. Full Stack, AI & ML, DevOps…"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Brief description of the team…"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Lead</label>
            <select {...register('lead')} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Select lead (optional)</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name} ({u.username})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
