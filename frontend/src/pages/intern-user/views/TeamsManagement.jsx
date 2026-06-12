import { useEffect, useState } from 'react'
import api from '../../../services/api'
import PageHeader from '../../../components/common/PageHeader'
import { Users } from 'lucide-react'

export default function TeamsManagement() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.get('/teams/').then(r => setTeams(r.data)).finally(() => setLoading(false)) }, [])

  return (
    <div className="space-y-4">
      <PageHeader title="My Teams" subtitle="Your team and mentor information" />
      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map(t => (
            <div key={t.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.name}</h3>
                  <p className="text-xs text-gray-500">Team Lead ID: {t.lead || '—'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{t.description || 'No description'}</p>
              <p className="text-xs text-gray-400 mt-2">Created: {t.created_at?.slice(0, 10)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
