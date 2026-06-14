import { useEffect, useState } from 'react'
import ConfirmModal from '../../../components/modals/ConfirmModal'
import { getPayrolls, deletePayroll } from '../../../services/payrollAPI'
import { getUsers } from '../../../services/usersAPI'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import Table from '../../../components/tables/Table'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'

export default function PayrollRecords() {
  const [payrolls, setPayrolls] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { query, setQuery, filtered } = useSearch(payrolls, ['payment_date', 'payment_status', 'intern_type'])

  const load = () => {
    setLoading(true)
    Promise.all([getPayrolls(), getUsers()])
      .then(([p, u]) => { setPayrolls(p.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const getName = (id) => users.find(u => u.id === id)?.username || id
  const executeDelete = async (id) => {
    await deletePayroll(id); toast.success('Deleted'); load()
  }

  const columns = [
    { key: 'employee', label: 'Employee', render: r => getName(r.employee) },
    { key: 'basic_salary', label: 'Basic', render: r => `₹${r.basic_salary}` },
    { key: 'bonus', label: 'Bonus', render: r => `₹${r.bonus}` },
    { key: 'deductions', label: 'Deductions', render: r => `₹${r.deductions}` },
    { key: 'final_salary', label: 'Final', render: r => <span className="font-semibold text-green-600">₹{r.final_salary}</span> },
    { key: 'payment_date', label: 'Date' },
    { key: 'actions', label: '', render: r => (
      <button onClick={() => setDeletingId(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
    )},
  ]

  return (
    <div>
      <PageHeader title="Payroll Records" subtitle={`${filtered.length} of ${payrolls.length} records`} />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by date, status, type…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
