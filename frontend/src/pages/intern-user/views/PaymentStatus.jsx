import { useEffect, useState } from 'react'
import { getInternPayments } from '../../../services/payrollAPI'
import useAuth from '../../../hooks/useAuth'
import PageHeader from '../../../components/common/PageHeader'
import StatCard from '../../../components/cards/StatCard'
import Table from '../../../components/tables/Table'
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react'

const STATUS_COLORS = {
  PAID:           'bg-green-100 text-green-700',
  UNPAID:         'bg-red-100 text-red-700',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
}
const STATUS_LABELS = { PAID: 'Paid', UNPAID: 'Unpaid', PARTIALLY_PAID: 'Partially Paid' }

export default function PaymentStatus() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInternPayments().then(r => setPayments(r.data)).finally(() => setLoading(false))
  }, [])

  // Aggregate across all records for this intern
  const totalFee  = payments.reduce((s, p) => s + parseFloat(p.internship_fee || 0), 0)
  const totalPaid = payments.reduce((s, p) => s + parseFloat(p.amount_paid || 0), 0)
  const balance   = totalFee - totalPaid
  const latest    = payments[payments.length - 1]
  const overallStatus = balance <= 0 ? 'PAID' : totalPaid <= 0 ? 'UNPAID' : 'PARTIALLY_PAID'

  // Progress bar percentage
  const pct = totalFee > 0 ? Math.min(100, (totalPaid / totalFee) * 100).toFixed(1) : 0

  const columns = [
    { key: 'internship_fee',  label: 'Fee',     render: r => `₹${r.internship_fee}` },
    { key: 'amount_paid',     label: 'Paid',    render: r => <span className="text-green-600 font-medium">₹{r.amount_paid}</span> },
    { key: 'balance_amount',  label: 'Balance', render: r => <span className="text-red-500 font-medium">₹{r.balance_amount}</span> },
    { key: 'payment_status',  label: 'Status',  render: r => (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[r.payment_status] || ''}`}>
        {STATUS_LABELS[r.payment_status] || r.payment_status}
      </span>
    )},
    { key: 'payment_method',  label: 'Method',  render: r => r.payment_method || '—' },
    { key: 'payment_date',    label: 'Date',    render: r => r.payment_date || '—' },
    { key: 'transaction_id',  label: 'Txn ID',  render: r => r.transaction_id || '—' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="My Payment" subtitle="Internship fee payment status" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Internship Fee"  value={`₹${totalFee.toLocaleString()}`}  icon={Wallet}       color="blue" />
        <StatCard title="Amount Paid"     value={`₹${totalPaid.toLocaleString()}`} icon={CheckCircle}  color="green" />
        <StatCard title="Balance Due"     value={`₹${balance.toLocaleString()}`}   icon={AlertCircle}  color={balance > 0 ? 'red' : 'green'} />
      </div>

      {/* Status + progress */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Payment Progress</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[overallStatus]}`}>
            {STATUS_LABELS[overallStatus]}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${overallStatus === 'PAID' ? 'bg-green-500' : 'bg-yellow-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>₹0</span>
          <span className="font-medium text-gray-600">{pct}% paid</span>
          <span>₹{totalFee.toLocaleString()}</span>
        </div>
      </div>

      {/* History table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-700">Payment History</h3>
        </div>
        <Table columns={columns} data={payments} loading={loading} emptyTitle="No payment records yet" />
      </div>
    </div>
  )
}
