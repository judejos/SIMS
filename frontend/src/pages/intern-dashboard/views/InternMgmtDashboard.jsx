import { useEffect, useState } from 'react'
import { getInterns } from '../../../services/internsAPI'
import { getUsers } from '../../../services/usersAPI'
import StatCard from '../../../components/cards/StatCard'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import { UserCheck, Users, AlertTriangle, CheckCircle } from 'lucide-react'

export default function InternMgmtDashboard() {
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getInterns().then(r => setInterns(r.data)).finally(() => setLoading(false)) }, [])

  const active = interns.filter(i => i.status === 'active').length
  const completed = interns.filter(i => i.status === 'completed').length
  const terminated = interns.filter(i => i.status === 'terminated').length

  const columns = [
    { key: 'user', label: 'User ID' },
    { key: 'college', label: 'College', render: r => r.college || '—' },
    { key: 'degree', label: 'Degree', render: r => r.degree || '—' },
    { key: 'start_date', label: 'Start' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Interns" value={interns.length} icon={Users} color="blue" />
        <StatCard title="Active" value={active} icon={UserCheck} color="green" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} color="purple" />
        <StatCard title="Terminated" value={terminated} icon={AlertTriangle} color="red" />
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">All Interns</h3>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">AI Risk Flags: Coming Soon</span>
        </div>
        <Table columns={columns} data={interns} loading={loading} />
      </div>
    </div>
  )
}
