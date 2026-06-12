import { useState } from 'react'
import { getInternInsights } from '../../services/aiAPI'
import toast from 'react-hot-toast'

export default function PerformanceAnalysis() {
  const [userId, setUserId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await getInternInsights(userId)
      setData(res.data)
    } catch {
      toast.error('User not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800">Performance Analysis</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex gap-2">
          <input
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="Enter User ID"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button onClick={analyze} disabled={loading} className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-60">
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {data && (
          <div className="space-y-3 border-t pt-4">
            {Object.entries(data).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-500 capitalize">{k.replace(/_/g, ' ')}</span>
                <span className="font-semibold text-gray-800">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
