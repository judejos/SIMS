import { useEffect, useState } from 'react'
import { getTasks } from '../../../services/tasksAPI'
import { getAttendance } from '../../../services/attendanceAPI'
import useAuth from '../../../hooks/useAuth'
import StatCard from '../../../components/cards/StatCard'
import { ClipboardList, CheckCircle, CalendarCheck, Star } from 'lucide-react'

export default function MyDashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [attendance, setAttendance] = useState([])

  useEffect(() => {
    getTasks().then(r => setTasks(r.data))
    getAttendance().then(r => setAttendance(r.data))
  }, [])

  const myTasks = tasks.filter(t => t.assigned_to === user?.id)
  const completed = myTasks.filter(t => t.status === 'completed').length
  const present = attendance.filter(a => a.user === user?.id && a.status === 'present').length
  const rate = myTasks.length ? Math.round((completed / myTasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.username}! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your internship overview</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Tasks" value={myTasks.length} icon={ClipboardList} color="blue" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} color="green" />
        <StatCard title="Present Days" value={present} icon={CalendarCheck} color="yellow" />
        <StatCard title="Task Rate" value={`${rate}%`} icon={Star} color="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Pending Tasks</h3>
          {myTasks.filter(t => t.status === 'pending').length === 0
            ? <p className="text-gray-400 text-sm">No pending tasks 🎉</p>
            : myTasks.filter(t => t.status === 'pending').slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-gray-700">{t.title}</span>
                <span className="text-xs text-gray-400">{t.due_date || 'No due date'}</span>
              </div>
            ))
          }
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Recent Attendance</h3>
          {attendance.filter(a => a.user === user?.id).slice(0, 5).map(a => (
            <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm text-gray-700">{a.date}</span>
              <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full ${
                a.status === 'present' ? 'bg-green-100 text-green-700' :
                a.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
