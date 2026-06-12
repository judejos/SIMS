import { useEffect, useState } from 'react'
import { getAttendance } from '../../../services/attendanceAPI'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function AttendanceReports() {
  const [records, setRecords] = useState([])
  useEffect(() => { getAttendance().then(r => setRecords(r.data)) }, [])

  const byDate = records.reduce((acc, r) => {
    const d = r.date
    if (!acc[d]) acc[d] = { date: d, present: 0, absent: 0, late: 0 }
    if (['present','absent','late'].includes(r.status)) acc[d][r.status]++
    return acc
  }, {})
  const chartData = Object.values(byDate).slice(-7)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Attendance Reports</h2>
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" /><YAxis /><Tooltip /><Legend />
            <Bar dataKey="present" fill="#10b981" radius={[4,4,0,0]} />
            <Bar dataKey="absent" fill="#ef4444" radius={[4,4,0,0]} />
            <Bar dataKey="late" fill="#f59e0b" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
