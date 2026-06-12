import { useEffect, useState } from 'react'
import { getTasks } from '../../../services/tasksAPI'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#f59e0b', '#6366f1', '#10b981']

export default function TaskReports() {
  const [tasks, setTasks] = useState([])
  useEffect(() => { getTasks().then(r => setTasks(r.data)) }, [])

  const data = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
  ]
  const byPriority = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Task Reports</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">By Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie><Tooltip /><Legend /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">By Priority</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={byPriority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {byPriority.map((_, i) => <Cell key={i} fill={['#ef4444','#f59e0b','#10b981'][i]} />)}
            </Pie><Tooltip /><Legend /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
