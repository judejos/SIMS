import { useEffect, useState } from 'react'
import { getPayrolls } from '../../../services/payrollAPI'
import { getUsers } from '../../../services/usersAPI'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function PayrollReports() {
  const [payrolls, setPayrolls] = useState([])
  const [users, setUsers] = useState([])
  useEffect(() => {
    Promise.all([getPayrolls(), getUsers()]).then(([p, u]) => { setPayrolls(p.data); setUsers(u.data) })
  }, [])

  const getName = (id) => users.find(u => u.id === id)?.username || id
  const chartData = payrolls.map(p => ({ name: getName(p.employee), salary: parseFloat(p.final_salary) }))

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Payroll Reports</h2>
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Salary Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" /><YAxis /><Tooltip />
            <Bar dataKey="salary" fill="#10b981" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
