import useFetch from '../../hooks/useFetch'
import api from '../../services/api'

export default function Reports() {
  const { data, loading } = useFetch(() => api.get('/reports/dashboard/'))
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? <p className="text-gray-500">Loading...</p> : (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data || {}).map(([k, v]) => (
              <div key={k} className="border rounded-lg p-4">
                <p className="text-gray-500 text-sm capitalize">{k.replace(/_/g, ' ')}</p>
                <p className="text-3xl font-bold text-primary-600">{v}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
