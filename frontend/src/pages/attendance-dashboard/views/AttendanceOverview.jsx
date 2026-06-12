import { useEffect, useState } from 'react'
import { getAttendance } from '../../../services/attendanceAPI'
import StatCard from '../../../components/cards/StatCard'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import { CalendarCheck, CalendarX, Clock, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AttendanceOverview() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getAttendance().then(r => setRecords(r.data)).finally(() => setLoading(false)) }, [])

  const present = records.filter(r => r.status === 'present').length
  const absent = records.filter(r => r.status === 'absent').length
  const late = records.filter(r => r.status === 'late').length
  const halfDay = records.filter(r => r.status === 'half_day').length

  const chartData = [
    { name: 'Present', count: present },
    { name: 'Absent', count: absent },
    { name: 'Late', count: late },
    { name: 'Half Day', count: halfDay },
  ]

  const columns = [
    { key: 'user', label: 'User ID' },
    { key: 'date', label: 'Date' },
    { key: 'check_in', label: 'In', render: r => r.check_in || '—' },
    { key: 'check_out', label: 'Out', render: r => r.check_out || '—' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Present" value={present} icon={CalendarCheck} color="green" />
        <StatCard title="Absent" value={absent} icon={CalendarX} color="red" />
        <StatCard title="Late" value={late} icon={Clock} color="yellow" />
        <StatCard title="Half Day" value={halfDay} icon={Users} color="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Attendance Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="count" fill="#0d9488" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-700">Recent Records</h3></div>
          <Table columns={columns} data={records.slice(0, 6)} loading={loading} />
        </div>
      </div>
    </div>
  )
}
