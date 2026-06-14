import { Users, ClipboardList, CalendarCheck, FileText } from 'lucide-react'
import StatCard from '../../components/cards/StatCard'
import AttendanceTimer from '../../components/widgets/AttendanceTimer'

export default function InternDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="My Tasks" value={5} icon={ClipboardList} color="blue" />
          <StatCard title="Attendance" value="85%" icon={CalendarCheck} color="green" />
          <StatCard title="Performance" value="Good" icon={Users} color="purple" />
        </div>
        <div className="lg:col-span-1">
          <AttendanceTimer />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-sm">No recent activity.</p>
      </div>
    </div>
  )
}
