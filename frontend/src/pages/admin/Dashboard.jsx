import { useEffect, useState } from 'react'
import { Users, UserCheck, Wallet, CalendarCheck, TrendingUp, AlertTriangle, Eye } from 'lucide-react'
import StatCard from '../../components/cards/StatCard'
import api from '../../services/api'
import useAuth from '../../hooks/useAuth'
import { isAdminViewOnly } from '../../utils/permissions'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AdminDashboard() {
  const { user } = useAuth()
  const viewOnly = isAdminViewOnly(user?.role)
  const [stats, setStats] = useState(null)
  const [interns, setInterns] = useState([])
  const [attendance, setAttendance] = useState([])
  const [payrolls, setPayrolls] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/reports/dashboard/'),
      api.get('/interns/'),
      api.get('/attendance/'),
      api.get('/payroll/'),
      api.get('/tasks/'),
    ]).then(([s, i, a, p, t]) => {
      setStats(s.data)
      setInterns(i.data)
      setAttendance(a.data)
      setPayrolls(p.data)
      setTasks(t.data)
    }).finally(() => setLoading(false))
  }, [])

  // Intern status distribution
  const internStatus = [
    { name: 'Active', value: interns.filter(i => i.status === 'active').length },
    { name: 'Completed', value: interns.filter(i => i.status === 'completed').length },
    { name: 'Terminated', value: interns.filter(i => i.status === 'terminated').length },
  ]

  // Attendance breakdown
  const attendanceBreakdown = [
    { name: 'Present', value: attendance.filter(a => a.status === 'present').length },
    { name: 'Absent', value: attendance.filter(a => a.status === 'absent').length },
    { name: 'Late', value: attendance.filter(a => a.status === 'late').length },
    { name: 'Half Day', value: attendance.filter(a => a.status === 'half_day').length },
  ]

  // Task status
  const taskStatus = [
    { name: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
    { name: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length },
    { name: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ]

  // Payroll trend (last 6 records)
  const payrollTrend = payrolls.slice(-6).map(p => ({
    date: p.payment_date,
    amount: parseFloat(p.final_salary),
  }))

  const totalPayroll = payrolls.reduce((s, p) => s + parseFloat(p.final_salary || 0), 0)
  const attendanceRate = attendance.length
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          {viewOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
              <Eye size={13} /> View Only
            </span>
          )}
        </div>
        <span className="text-sm text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.total_users ?? 0} icon={Users} color="blue" />
        <StatCard title="Active Interns" value={interns.filter(i => i.status === 'active').length} icon={UserCheck} color="green" />
        <StatCard title="Attendance Rate" value={`${attendanceRate}%`} icon={CalendarCheck} color="yellow" />
        <StatCard title="Total Payroll" value={`₹${totalPayroll.toFixed(0)}`} icon={Wallet} color="purple" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Intern Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={internStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {internStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Task Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={taskStatus}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis /><Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Attendance Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={attendanceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {attendanceBreakdown.map((_, i) => <Cell key={i} fill={['#10b981','#ef4444','#f59e0b','#8b5cf6'][i]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Payroll Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={payrollTrend}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis /><Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Tasks', value: tasks.length, icon: TrendingUp, color: 'text-blue-600' },
              { label: 'Completed Tasks', value: tasks.filter(t => t.status === 'completed').length, icon: UserCheck, color: 'text-green-600' },
              { label: 'Payroll Records', value: payrolls.length, icon: Wallet, color: 'text-purple-600' },
              { label: 'At-Risk Interns', value: interns.filter(i => i.status === 'terminated').length, icon: AlertTriangle, color: 'text-red-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={color} />
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className={`font-bold text-lg ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Interns Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Recent Interns</h3>
          <span className="text-xs text-gray-400">{interns.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">User ID</th>
                <th className="px-5 py-3 text-left">College</th>
                <th className="px-5 py-3 text-left">Start Date</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {interns.slice(0, 5).map(i => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{i.user}</td>
                  <td className="px-5 py-3 text-gray-500">{i.college || '—'}</td>
                  <td className="px-5 py-3 text-gray-500">{i.start_date}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      i.status === 'active' ? 'bg-green-100 text-green-700' :
                      i.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>{i.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
