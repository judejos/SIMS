import { useEffect, useState } from 'react'
import { getInternPayments, getInternPaymentSummary } from '../../../services/payrollAPI'
import StatCard from '../../../components/cards/StatCard'
import Table from '../../../components/tables/Table'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'
import { Wallet, CheckCircle, AlertCircle, Clock, Users } from 'lucide-react'

const STATUS_COLORS = {
  PAID:           'bg-green-100 text-green-700',
  UNPAID:         'bg-red-100 text-red-700',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
}
const STATUS_LABELS = { PAID: 'Paid', UNPAID: 'Unpaid', PARTIALLY_PAID: 'Partially Paid' }

export default function InternFees() {
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const statusFiltered = statusFilter === 'ALL' ? payments : payments.filter(p => p.payment_status === statusFilter)
  const { query, setQuery, filtered } = useSearch(statusFiltered, ['intern_name', 'payment_status', 'transaction_id'])

  useEffect(() => {
    Promise.all([getInternPayments(), getInternPaymentSummary()])
      .then(([p, s]) => { setPayments(p.data); setSummary(s.data) })
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    { key: 'intern_name', label: 'Intern' },
    { key: 'internship_fee', label: 'Fee', render: r => `₹${r.internship_fee}` },
    { key: 'amount_paid', label: 'Paid', render: r => <span className="text-green-600 font-medium">₹{r.amount_paid}</span> },
    { key: 'balance_amount', label: 'Balance', render: r => <span className="text-red-500 font-medium">₹{r.balance_amount}</span> },
    { key: 'payment_status', label: 'Status', render: r => (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[r.payment_status] || ''}`}>
        {STATUS_LABELS[r.payment_status] || r.payment_status}
      </span>
    )},
    { key: 'payment_date', label: 'Date', render: r => r.payment_date || '—' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Intern Fee Payments" subtitle={`${filtered.length} of ${payments.length} records`} />

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Fee"       value={`₹${Number(summary.total_fee).toLocaleString()}`}     icon={Wallet}      color="blue" />
          <StatCard title="Collected"       value={`₹${Number(summary.total_paid).toLocaleString()}`}    icon={CheckCircle} color="green" />
          <StatCard title="Pending"         value={`₹${Number(summary.total_pending).toLocaleString()}`} icon={AlertCircle} color="red" />
          <StatCard title="Paid"            value={summary.paid_count}                                    icon={Users}       color="green" />
          <StatCard title="Not Fully Paid"  value={summary.unpaid_count + summary.partial_count}          icon={Clock}       color="yellow" />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b flex flex-wrap items-center gap-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Search intern, status…" className="w-60" />
          <div className="flex gap-1 ml-auto">
            {['ALL', 'PAID', 'PARTIALLY_PAID', 'UNPAID'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {s === 'ALL' ? 'All' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
