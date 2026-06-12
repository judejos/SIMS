import { useEffect, useState } from 'react'
import { getInternInsights } from '../../../services/aiAPI'
import useAuth from '../../../hooks/useAuth'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'

export default function MyPerformance() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!user?.id) return
    setLoading(true)
    try { const r = await getInternInsights(user.id); setData(r.data) }
    catch {} finally { setLoading(false) }
  }
  useEffect(() => { load() }, [user])

  return (
    <div className="space-y-4 max-w-xl">
      <PageHeader title="My Performance" />
      {loading && <p className="text-gray-400">Loading...</p>}
      {data && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm border-b pb-2 last:border-0">
              <span className="text-gray-500 capitalize">{k.replace(/_/g, ' ')}</span>
              <span className="font-semibold text-gray-800">{v}</span>
            </div>
          ))}
        </div>
      )}
      <Button onClick={load} disabled={loading}>Refresh</Button>
    </div>
  )
}
