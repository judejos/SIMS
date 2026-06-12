import { useEffect, useState } from 'react'
import { getTasks, updateTask } from '../../../services/tasksAPI'
import { getUsers } from '../../../services/usersAPI'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import toast from 'react-hot-toast'

export default function CompletionList() {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([getTasks(), getUsers()])
      .then(([t, u]) => { setTasks(t.data.filter(t => t.status === 'completed')); setUsers(u.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const getName = (id) => users.find(u => u.id === id)?.username || id

  const columns = [
    { key: 'title', label: 'Task' },
    { key: 'assigned_to', label: 'Completed By', render: r => getName(r.assigned_to) },
    { key: 'priority', label: 'Priority', render: r => <Badge value={r.priority} /> },
    { key: 'due_date', label: 'Due Date', render: r => r.due_date || '—' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Completion List" subtitle={`${tasks.length} tasks completed`} />
      <div className="bg-white rounded-xl shadow-sm"><Table columns={columns} data={tasks} loading={loading} /></div>
    </div>
  )
}
