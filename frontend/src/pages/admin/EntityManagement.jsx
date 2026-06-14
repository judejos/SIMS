import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import api from '../../services/api'
import Table from '../../components/tables/Table'
import ConfirmModal from '../../components/modals/ConfirmModal'
import Modal from '../../components/modals/Modal'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'

export default function EntityManagement() {
  const [entities, setEntities] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset, setValue } = useForm()

  // Using teams as proxy for entities until a dedicated entity model exists
  const load = () => {
    setLoading(true)
    api.get('/teams/').then(r => setEntities(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); reset(); setModal(true) }
  const openEdit = (e) => { setEditing(e); setValue('name', e.name); setValue('description', e.description); setModal(true) }
  const onSubmit = async (data) => {
    try {
      editing ? await api.patch(`/teams/${editing.id}/`, data) : await api.post('/teams/', data)
      toast.success('Saved!'); setModal(false); load()
    } catch { toast.error('Failed') }
  }
  const executeDelete = async (id) => {
    await api.delete(`/teams/${id}/`); toast.success('Deleted'); load()
  }

  const columns = [
    { key: 'name', label: 'Entity / Team Name' },
    { key: 'description', label: 'Description', render: r => r.description || '—' },
    { key: 'created_at', label: 'Created', render: r => r.created_at?.slice(0, 10) },
    { key: 'actions', label: '', render: r => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
        <button onClick={() => setDeletingId(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Entity Management" subtitle="Manage entities, branches and departments" action={<Button onClick={openAdd}><Plus size={15} className="inline mr-1" />Add Entity</Button>} />
      <div className="bg-white rounded-xl shadow-sm"><Table columns={columns} data={entities} loading={loading} /></div>
      
      <ConfirmModal 
        open={!!deletingId} 
        onClose={() => setDeletingId(null)} 
        onConfirm={() => executeDelete(deletingId)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Entity' : 'Add Entity'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input {...register('name', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
