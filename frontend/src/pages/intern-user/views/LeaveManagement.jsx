import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import Badge from '../../../components/common/Badge'

const MOCK_LEAVES = [
  { id: 1, type: 'Sick Leave', from: '2024-02-05', to: '2024-02-06', days: 2, status: 'completed', reason: 'Fever' },
  { id: 2, type: 'Casual Leave', from: '2024-03-10', to: '2024-03-10', days: 1, status: 'pending', reason: 'Personal work' },
]

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState(MOCK_LEAVES)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data) => {
    const from = new Date(data.from), to = new Date(data.to)
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1
    setLeaves(l => [...l, { id: Date.now(), ...data, days, status: 'pending' }])
    toast.success('Leave request submitted!'); setShowForm(false); reset()
  }

  const balance = { casual: 10, sick: 7, earned: 5 }
  const used = leaves.filter(l => l.status === 'completed').reduce((s, l) => s + l.days, 0)

  return (
    <div className="space-y-6">
      <PageHeader title="Leave Management" action={<Button onClick={() => setShowForm(s => !s)}>+ Apply Leave</Button>} />

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(balance).map(([type, days]) => (
          <div key={type} className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{days}</p>
            <p className="text-sm text-gray-500 capitalize mt-1">{type} Leave Balance</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Apply for Leave</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select {...register('type', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input type="date" {...register('from', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input type="date" {...register('to', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea {...register('reason', { required: true })} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Submit</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-700">Leave History</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">From</th>
              <th className="px-5 py-3 text-left">To</th>
              <th className="px-5 py-3 text-left">Days</th>
              <th className="px-5 py-3 text-left">Reason</th>
              <th className="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaves.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">{l.type}</td>
                <td className="px-5 py-3">{l.from}</td>
                <td className="px-5 py-3">{l.to}</td>
                <td className="px-5 py-3">{l.days}</td>
                <td className="px-5 py-3 text-gray-500">{l.reason}</td>
                <td className="px-5 py-3"><Badge value={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
