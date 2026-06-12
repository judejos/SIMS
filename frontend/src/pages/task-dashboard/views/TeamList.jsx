import { useEffect, useState } from 'react'
import api from '../../../services/api'
import Table from '../../../components/tables/Table'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'

export default function TeamList() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const { query, setQuery, filtered } = useSearch(teams, ['name', 'description'])

  useEffect(() => { api.get('/teams/').then(r => setTeams(r.data)).finally(() => setLoading(false)) }, [])

  const columns = [
    { key: 'name', label: 'Team' },
    { key: 'description', label: 'Description', render: r => r.description || '—' },
    { key: 'created_at', label: 'Created', render: r => r.created_at?.slice(0, 10) },
  ]
  return (
    <div>
      <PageHeader title="Teams" subtitle={`${filtered.length} of ${teams.length} teams`} />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by team name or description…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
