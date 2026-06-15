import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, LayoutGrid, List as ListIcon } from 'lucide-react'
import { getTasks, createTask, updateTask, deleteTask } from '../../../services/tasksAPI'
import { getUsers } from '../../../services/usersAPI'
import Table from '../../../components/tables/Table'
import ConfirmModal from '../../../components/modals/ConfirmModal'
import Modal from '../../../components/modals/Modal'
import Button from '../../../components/common/Button'
import Badge from '../../../components/common/Badge'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'
import useAuth from '../../../hooks/useAuth'
import { canWrite } from '../../../utils/permissions'
import KanbanBoard from '../../../components/kanban/KanbanBoard'

export default function TaskList() {
  const { user: me } = useAuth()
  const writable = canWrite(me?.role)
  const [tasks, setTasks] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewMode, setViewMode] = useState('board') // 'list' or 'board'
  
  const { register, handleSubmit, reset, setValue } = useForm()
  const { query, setQuery, filtered } = useSearch(tasks, ['title', 'description', 'status', 'priority'])

  const load = () => {
    setLoading(true)
    Promise.all([getTasks(), getUsers()])
      .then(([t, u]) => { setTasks(t.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); reset(); setModal(true) }
  const openEdit = (t) => {
    setEditing(t)
    Object.entries(t).forEach(([k, v]) => setValue(k, v))
    setModal(true)
  }

  const onSubmit = async (data) => {
    try {
      editing ? await updateTask(editing.id, data) : await createTask(data)
      toast.success(editing ? 'Task updated!' : 'Task created!')
      setModal(false); load()
    } catch { toast.error('Failed to save task') }
  }

  const executeDelete = async (id) => {
    await deleteTask(id); toast.success('Deleted'); load()
  }

  const getName = (id) => users.find(u => u.id === id)?.username || '—'

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'assigned_to', label: 'Assigned To', render: r => getName(r.assigned_to) },
    { key: 'priority', label: 'Priority', render: r => <Badge value={r.priority} /> },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'due_date', label: 'Due', render: r => r.due_date || '—' },
    ...(writable ? [{ key: 'actions', label: '', render: r => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
        <button onClick={() => setDeletingId(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
      </div>
    )}] : []),
  ]

  return (
    <div>
      <PageHeader 
        title="Tasks Overview" 
        subtitle={`${filtered.length} of ${tasks.length} tasks`} 
        action={
          <div className="flex gap-4 items-center">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('board')} 
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="Board View"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="List View"
              >
                <ListIcon size={18} />
              </button>
            </div>
            {writable && <Button onClick={openAdd}><Plus size={15} className="inline mr-1" />New Task</Button>}
          </div>
        } 
      />
      
      <div className="mb-6">
        <SearchBar value={query} onChange={setQuery} placeholder="Search tasks by title, status, priority…" className="max-w-md bg-white shadow-sm border-0" />
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-gray-400">Loading tasks...</div>
      ) : viewMode === 'board' ? (
        <KanbanBoard tasks={filtered} users={users} onEdit={openEdit} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Table columns={columns} data={filtered} loading={loading} />
        </div>
      )}

      
      <ConfirmModal 
        open={!!deletingId} 
        onClose={() => setDeletingId(null)} 
        onConfirm={() => executeDelete(deletingId)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Task' : 'New Task'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input {...register('title', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select {...register('assigned_to')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select {...register('priority')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="verified">Verified</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" {...register('due_date')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
