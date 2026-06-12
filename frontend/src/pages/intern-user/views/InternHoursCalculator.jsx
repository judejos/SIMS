import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getAttendance } from '../../../services/attendanceAPI'
import useAuth from '../../../hooks/useAuth'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'

export default function InternHoursCalculator() {
  const { user } = useAuth()
  const { register, handleSubmit } = useForm()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const calculate = async (data) => {
    setLoading(true)
    try {
      const res = await getAttendance()
      const records = res.data.filter(r => {
        if (r.user !== user?.id) return false
        const d = new Date(r.date)
        return d >= new Date(data.from) && d <= new Date(data.to)
      })
      let totalMinutes = 0
      records.forEach(r => {
        if (r.check_in && r.check_out) {
          const [ih, im] = r.check_in.split(':').map(Number)
          const [oh, om] = r.check_out.split(':').map(Number)
          totalMinutes += (oh * 60 + om) - (ih * 60 + im)
        }
      })
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      setResult({ records: records.length, hours, minutes, totalMinutes })
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-lg space-y-4">
      <PageHeader title="Hours Calculator" subtitle="Calculate your working hours for any date range" />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(calculate)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input type="date" {...register('from', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input type="date" {...register('to', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Calculating...' : 'Calculate Hours'}
          </Button>
        </form>
        {result && (
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-600">{result.records}</p>
              <p className="text-xs text-gray-500 mt-1">Days Recorded</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-green-600">{result.hours}h</p>
              <p className="text-xs text-gray-500 mt-1">Total Hours</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-purple-600">{result.minutes}m</p>
              <p className="text-xs text-gray-500 mt-1">Extra Minutes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
