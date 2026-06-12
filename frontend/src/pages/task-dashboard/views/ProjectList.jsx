import { useEffect, useState } from 'react'
import api from '../../../services/api'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { query, setQuery, filtered } = useSearch(projects, ['name', 'description', 'status'])

  useEffect(() => { api.get('/projects/').then(r => setProjects(r.data)).finally(() => setLoading(false)) }, [])

  const columns = [
    { key: 'name', label: 'Project' },
    { key: 'description', label: 'Description', render: r => r.description || '—' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'start_date', label: 'Start', render: r => r.start_date || '—' },
    { key: 'end_date', label: 'End', render: r => r.end_date || '—' },
  ]
  return (
    <div>
      <PageHeader title="Projects" subtitle={`${filtered.length} of ${projects.length} projects`} />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name, description, status…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
