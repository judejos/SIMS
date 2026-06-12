import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getAssets, createAsset, updateAsset, deleteAsset } from '../../../services/assetsAPI'
import { getUsers } from '../../../services/usersAPI'
import Table from '../../../components/tables/Table'
import Modal from '../../../components/modals/Modal'
import Button from '../../../components/common/Button'
import Badge from '../../../components/common/Badge'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'

export default function AssetList() {
  const [assets, setAssets] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset, setValue } = useForm()
  const { query, setQuery, filtered } = useSearch(assets, ['asset_name', 'asset_id', 'status'])

  const load = () => {
    setLoading(true)
    Promise.all([getAssets(), getUsers()])
      .then(([a, u]) => { setAssets(a.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); reset(); setModal(true) }
  const openEdit = (a) => { setEditing(a); Object.entries(a).forEach(([k, v]) => setValue(k, v)); setModal(true) }
  const onSubmit = async (data) => {
    try {
      editing ? await updateAsset(editing.id, data) : await createAsset(data)
      toast.success('Saved!'); setModal(false); load()
    } catch { toast.error('Failed') }
  }
  const onDelete = async (id) => {
    if (!confirm('Delete?')) return
    await deleteAsset(id); toast.success('Deleted'); load()
  }
  const getName = (id) => users.find(u => u.id === id)?.username || '—'

  const columns = [
    { key: 'asset_name', label: 'Asset' },
    { key: 'asset_id', label: 'ID' },
    { key: 'assigned_to', label: 'Assigned To', render: r => r.assigned_to ? getName(r.assigned_to) : '—' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'purchase_date', label: 'Purchased' },
    { key: 'actions', label: '', render: r => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
        <button onClick={() => onDelete(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="All Assets" subtitle={`${filtered.length} of ${assets.length} assets`} action={<Button onClick={openAdd}><Plus size={15} className="inline mr-1" />Add Asset</Button>} />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name, asset ID, status…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Asset' : 'Add Asset'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
              <input {...register('asset_name', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset ID</label>
              <input {...register('asset_id', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select {...register('assigned_to')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="repair">Repair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
              <input type="date" {...register('purchase_date', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
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
