import { useEffect, useState } from 'react'
import { getPayrolls } from '../../../services/payrollAPI'
import { getUsers } from '../../../services/usersAPI'
import StatCard from '../../../components/cards/StatCard'
import Table from '../../../components/tables/Table'
import { Wallet, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function PayrollOverview() {
  const [payrolls, setPayrolls] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([getPayrolls(), getUsers()])
      .then(([p, u]) => { setPayrolls(p.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }, [])

  const total = payrolls.reduce((s, p) => s + parseFloat(p.final_salary || 0), 0)
  const avg = payrolls.length ? (total / payrolls.length).toFixed(0) : 0
  const getName = (id) => users.find(u => u.id === id)?.username || id

  const columns = [
    { key: 'employee', label: 'Employee', render: r => getName(r.employee) },
    { key: 'basic_salary', label: 'Basic', render: r => `₹${r.basic_salary}` },
    { key: 'bonus', label: 'Bonus', render: r => `₹${r.bonus}` },
    { key: 'deductions', label: 'Deductions', render: r => `₹${r.deductions}` },
    { key: 'final_salary', label: 'Final', render: r => <span className="font-semibold text-green-600">₹{r.final_salary}</span> },
    { key: 'payment_date', label: 'Date' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Disbursed" value={`₹${total.toFixed(0)}`} icon={Wallet} color="green" />
        <StatCard title="Avg Salary" value={`₹${avg}`} icon={TrendingUp} color="blue" />
        <StatCard title="Records" value={payrolls.length} icon={DollarSign} color="yellow" />
        <StatCard title="Employees" value={new Set(payrolls.map(p => p.employee)).size} icon={Users} color="purple" />
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-700">Recent Payroll</h3></div>
        <Table columns={columns} data={payrolls.slice(0, 5)} loading={loading} />
      </div>
    </div>
  )
}
