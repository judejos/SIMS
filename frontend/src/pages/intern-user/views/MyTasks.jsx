import { useEffect, useState } from 'react'
import { getTasks, updateTask } from '../../../services/tasksAPI'
import useAuth from '../../../hooks/useAuth'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'
import toast from 'react-hot-toast'

export default function MyTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { query, setQuery, filtered } = useSearch(tasks, ['title', 'status', 'priority'])

  const load = () => getTasks().then(r => setTasks(r.data.filter(t => t.assigned_to === user?.id))).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const markDone = async (id) => {
    await updateTask(id, { status: 'completed' })
    toast.success('Marked as completed!'); load()
  }

  const columns = [
    { key: 'title', label: 'Task' },
    { key: 'priority', label: 'Priority', render: r => <Badge value={r.priority} /> },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'due_date', label: 'Due', render: r => r.due_date || '—' },
    { key: 'actions', label: '', render: r => r.status !== 'completed' && (
      <Button size="sm" variant="success" onClick={() => markDone(r.id)}>Done</Button>
    )},
  ]

  return (
    <div>
      <PageHeader title="My Tasks" subtitle={`${filtered.length} of ${tasks.length} tasks`} />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by title, status, priority…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
