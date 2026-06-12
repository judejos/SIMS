import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Download } from 'lucide-react'
import { Wallet, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react'
import {
  getInternPayments, createInternPayment,
  updateInternPayment, deleteInternPayment, getInternPaymentSummary,
} from '../../services/payrollAPI'
import { getUsers } from '../../services/usersAPI'
import Table from '../../components/tables/Table'
import Modal from '../../components/modals/Modal'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import StatCard from '../../components/cards/StatCard'
import useSearch from '../../hooks/useSearch'

const STATUS_COLORS = {
  PAID:           'bg-green-100 text-green-700',
  UNPAID:         'bg-red-100 text-red-700',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
}
const STATUS_LABELS = { PAID: 'Paid', UNPAID: 'Unpaid', PARTIALLY_PAID: 'Partially Paid' }

function StatusBadge({ value }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[value] || 'bg-gray-100 text-gray-600'}`}>
      {STATUS_LABELS[value] || value}
    </span>
  )
}

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [users, setUsers] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const { register, handleSubmit, reset, setValue, watch } = useForm()

  const fee = parseFloat(watch('internship_fee') || 0)
  const paid = parseFloat(watch('amount_paid') || 0)
  const balance = Math.max(0, fee - paid).toFixed(2)

  const load = () => {
    setLoading(true)
    Promise.all([getInternPayments(), getUsers(), getInternPaymentSummary()])
      .then(([p, u, s]) => { setPayments(p.data); setUsers(u.data); setSummary(s.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const statusFiltered = statusFilter === 'ALL' ? payments : payments.filter(p => p.payment_status === statusFilter)
  const { query, setQuery, filtered } = useSearch(statusFiltered, ['intern_name', 'transaction_id', 'payment_status', 'payment_method'])

  const openAdd = () => { setEditing(null); reset(); setModal(true) }
  const openEdit = (p) => {
    setEditing(p)
    Object.entries(p).forEach(([k, v]) => setValue(k, v))
    setModal(true)
  }

  const onSubmit = async (data) => {
    try {
      editing ? await updateInternPayment(editing.id, data) : await createInternPayment(data)
      toast.success(editing ? 'Payment updated!' : 'Payment added!')
      setModal(false); load()
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to save')
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this payment record?')) return
    await deleteInternPayment(id); toast.success('Deleted'); load()
  }

  const exportCSV = () => {
    const rows = [['Intern', 'Fee', 'Paid', 'Balance', 'Status', 'Method', 'Date', 'Transaction ID']]
    filtered.forEach(p => rows.push([
      p.intern_name, p.internship_fee, p.amount_paid, p.balance_amount,
      p.payment_status, p.payment_method, p.payment_date || '', p.transaction_id,
    ]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv,' + encodeURIComponent(csv)
    a.download = 'intern_payments.csv'; a.click()
  }

  const columns = [
    { key: 'intern_name', label: 'Intern Name' },
    { key: 'internship_fee', label: 'Total Fee', render: r => `₹${r.internship_fee}` },
    { key: 'amount_paid', label: 'Paid', render: r => <span className="font-medium text-green-600">₹{r.amount_paid}</span> },
    { key: 'balance_amount', label: 'Balance', render: r => <span className="font-medium text-red-500">₹{r.balance_amount}</span> },
    { key: 'payment_status', label: 'Status', render: r => <StatusBadge value={r.payment_status} /> },
    { key: 'payment_date', label: 'Date', render: r => r.payment_date || '—' },
    { key: 'payment_method', label: 'Method', render: r => r.payment_method || '—' },
    { key: 'actions', label: '', render: r => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
        <button onClick={() => onDelete(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Intern Fee Payment Management"
        subtitle={`${filtered.length} of ${payments.length} records`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportCSV}><Download size={15} className="inline mr-1" />Export CSV</Button>
            <Button onClick={openAdd}><Plus size={15} className="inline mr-1" />Add Payment</Button>
          </div>
        }
      />

      {/* Analytics Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Fee"       value={`₹${Number(summary.total_fee).toLocaleString()}`}     icon={Wallet}       color="blue" />
          <StatCard title="Total Collected" value={`₹${Number(summary.total_paid).toLocaleString()}`}    icon={CheckCircle}  color="green" />
          <StatCard title="Total Pending"   value={`₹${Number(summary.total_pending).toLocaleString()}`} icon={AlertCircle}  color="red" />
          <StatCard title="Paid Interns"    value={summary.paid_count}                                    icon={Users}        color="green" />
          <StatCard title="Pending Interns" value={summary.unpaid_count + summary.partial_count}          icon={Clock}        color="yellow" />
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b flex flex-wrap items-center gap-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name, transaction ID…" className="w-64" />
          <div className="flex gap-1 ml-auto">
            {['ALL', 'PAID', 'PARTIALLY_PAID', 'UNPAID'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'ALL' ? 'All' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Payment' : 'Add Payment'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intern</label>
              <select {...register('intern', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select intern</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.username})</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internship Fee (₹)</label>
              <input type="number" step="0.01" {...register('internship_fee', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
              <input type="number" step="0.01" {...register('amount_paid', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          {/* Live balance preview */}
          <div className="bg-gray-50 rounded-lg px-4 py-2.5 flex justify-between text-sm">
            <span className="text-gray-500">Balance</span>
            <span className="font-semibold text-red-500">₹{balance}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select {...register('payment_method')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <input type="date" {...register('payment_date')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
            <input {...register('transaction_id')} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea {...register('remarks')} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
