import { useEffect, useState } from 'react'
import { getTasks } from '../../../services/tasksAPI'
import StatCard from '../../../components/cards/StatCard'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function TaskOverview() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getTasks().then(r => setTasks(r.data)).finally(() => setLoading(false)) }, [])

  const pending = tasks.filter(t => t.status === 'pending').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const completed = tasks.filter(t => t.status === 'completed').length

  const chartData = [
    { name: 'Pending', count: pending },
    { name: 'In Progress', count: inProgress },
    { name: 'Completed', count: completed },
  ]

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'priority', label: 'Priority', render: r => <Badge value={r.priority} /> },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'due_date', label: 'Due Date', render: r => r.due_date || '—' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total" value={tasks.length} icon={ClipboardList} color="blue" />
        <StatCard title="Pending" value={pending} icon={Clock} color="yellow" />
        <StatCard title="In Progress" value={inProgress} icon={AlertCircle} color="purple" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} color="green" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-700">Recent Tasks</h3></div>
          <Table columns={columns} data={tasks.slice(0, 5)} loading={loading} />
        </div>
      </div>
    </div>
  )
}
