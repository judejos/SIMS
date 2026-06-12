import { useEffect, useState } from 'react'
import { getAttendance } from '../../../services/attendanceAPI'
import useAuth from '../../../hooks/useAuth'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import StatCard from '../../../components/cards/StatCard'
import PageHeader from '../../../components/common/PageHeader'
import WorkTimer from '../../../components/common/WorkTimer'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'
import { CalendarCheck, CalendarX, Clock } from 'lucide-react'

export default function MyAttendance() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const { query, setQuery, filtered } = useSearch(records, ['date', 'status', 'notes'])

  useEffect(() => {
    getAttendance().then(r => setRecords(r.data.filter(a => a.user === user?.id))).finally(() => setLoading(false))
  }, [])

  const present = records.filter(r => r.status === 'present').length
  const absent = records.filter(r => r.status === 'absent').length
  const late = records.filter(r => r.status === 'late').length

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'check_in', label: 'Check In', render: r => r.check_in || '—' },
    { key: 'check_out', label: 'Check Out', render: r => r.check_out || '—' },
    { key: 'working_hours', label: 'Hours', render: r => r.working_hours ? `${r.working_hours}h` : '—' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'notes', label: 'Notes', render: r => r.notes || '—' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="My Attendance" />
      <WorkTimer />
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Present" value={present} icon={CalendarCheck} color="green" />
        <StatCard title="Absent" value={absent} icon={CalendarX} color="red" />
        <StatCard title="Late" value={late} icon={Clock} color="yellow" />
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">{filtered.length} of {records.length} records</span>
          <SearchBar value={query} onChange={setQuery} placeholder="Search by date, status…" className="w-56" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
