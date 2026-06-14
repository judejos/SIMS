import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { getPayrolls, createPayroll, deletePayroll } from '../../services/payrollAPI'
import { getUsers } from '../../services/usersAPI'
import Table from '../../components/tables/Table'
import ConfirmModal from '../../components/modals/ConfirmModal'
import Modal from '../../components/modals/Modal'
import Button from '../../components/common/Button'
import StatCard from '../../components/cards/StatCard'
import PageHeader from '../../components/common/PageHeader'
import { Wallet, TrendingUp, Users } from 'lucide-react'

export default function PayrollDashboard() {
  const [payrolls, setPayrolls] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const load = () => {
    setLoading(true)
    Promise.all([getPayrolls(), getUsers()])
      .then(([p, u]) => { setPayrolls(p.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const totalPaid = payrolls.reduce((s, p) => s + parseFloat(p.final_salary || 0), 0)
  const avgSalary = payrolls.length ? (totalPaid / payrolls.length).toFixed(0) : 0

  const getUserName = (id) => {
    const u = users.find(u => u.id === id)
    return u ? `${u.first_name} ${u.last_name}` : id
  }

  const onSubmit = async (data) => {
    try {
      await createPayroll(data)
      toast.success('Payroll record created!')
      setModal(false); reset(); load()
    } catch { toast.error('Failed to create payroll') }
  }

  const executeDelete = async (id) => {
    await deletePayroll(id); toast.success('Deleted'); load()
  }

  const columns = [
    { key: 'employee', label: 'Employee', render: r => getUserName(r.employee) },
    { key: 'basic_salary', label: 'Basic', render: r => `₹${r.basic_salary}` },
    { key: 'bonus', label: 'Bonus', render: r => `₹${r.bonus}` },
    { key: 'deductions', label: 'Deductions', render: r => `₹${r.deductions}` },
    { key: 'final_salary', label: 'Final', render: r => <span className="font-semibold text-green-600">₹{r.final_salary}</span> },
    { key: 'payment_date', label: 'Date' },
    {
      key: 'actions', label: '', render: r => (
        <button onClick={() => setDeletingId(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
      )
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Payroll" subtitle="Manage salary records" action={<Button onClick={() => setModal(true)}><Plus size={16} className="inline mr-1" />Add Record</Button>} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Disbursed" value={`₹${totalPaid.toFixed(0)}`} icon={Wallet} color="green" />
        <StatCard title="Avg Salary" value={`₹${avgSalary}`} icon={TrendingUp} color="blue" />
        <StatCard title="Records" value={payrolls.length} icon={Users} color="purple" />
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <Table columns={columns} data={payrolls} loading={loading} />
      </div>

      
      <ConfirmModal 
        open={!!deletingId} 
        onClose={() => setDeletingId(null)} 
        onConfirm={() => executeDelete(deletingId)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
      <Modal open={modal} onClose={() => setModal(false)} title="Add Payroll Record">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select {...register('employee', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Select employee</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username} — {u.first_name} {u.last_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
              <input type="number" step="0.01" {...register('basic_salary', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
              <input type="number" step="0.01" defaultValue="0" {...register('bonus')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
              <input type="number" step="0.01" defaultValue="0" {...register('deductions')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input type="date" {...register('payment_date', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
