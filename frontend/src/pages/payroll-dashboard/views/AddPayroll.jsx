import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createPayroll } from '../../../services/payrollAPI'
import { getUsers } from '../../../services/usersAPI'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'

export default function AddPayroll() {
  const [users, setUsers] = useState([])
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({ defaultValues: { bonus: 0, deductions: 0 } })
  useEffect(() => { getUsers().then(r => setUsers(r.data)) }, [])

  const basic = parseFloat(watch('basic_salary') || 0)
  const bonus = parseFloat(watch('bonus') || 0)
  const deductions = parseFloat(watch('deductions') || 0)
  const final = (basic + bonus - deductions).toFixed(2)

  const onSubmit = async (data) => {
    try {
      await createPayroll(data)
      toast.success('Payroll record created!')
      reset()
    } catch { toast.error('Failed') }
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Add Payroll Record" />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <input type="number" step="0.01" {...register('bonus')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
              <input type="number" step="0.01" {...register('deductions')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Final Salary</span>
            <span className="text-xl font-bold text-green-600">₹{final}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input type="date" {...register('payment_date', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </Button>
        </form>
      </div>
    </div>
  )
}
