import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { getTasks } from '../../services/tasksAPI'
import StatCard from '../../components/cards/StatCard'
import Table from '../../components/tables/Table'
import Badge from '../../components/common/Badge'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTasks().then(r => setTasks(r.data)).finally(() => setLoading(false))
  }, [])

  const pending = tasks.filter(t => t.status === 'pending').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const completed = tasks.filter(t => t.status === 'completed').length

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'priority', label: 'Priority', render: r => <Badge value={r.priority} /> },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'due_date', label: 'Due Date', render: r => r.due_date || '—' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle="Overview of all tasks"
        action={<Link to="/admin/tasks/create"><Button>+ Create Task</Button></Link>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={tasks.length} icon={ClipboardList} color="blue" />
        <StatCard title="Pending" value={pending} icon={Clock} color="yellow" />
        <StatCard title="In Progress" value={inProgress} icon={AlertCircle} color="purple" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} color="green" />
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Recent Tasks</h3>
          <Link to="/admin/tasks/list" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        <Table columns={columns} data={tasks.slice(0, 5)} loading={loading} />
      </div>
    </div>
  )
}
