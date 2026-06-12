import { useEffect, useState } from 'react'
import api from '../../../services/api'
import Table from '../../../components/tables/Table'
import PageHeader from '../../../components/common/PageHeader'

export default function TaskDepartments() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.get('/teams/').then(r => setTeams(r.data)).finally(() => setLoading(false)) }, [])
  const columns = [
    { key: 'name', label: 'Department / Team' },
    { key: 'description', label: 'Description', render: r => r.description || '—' },
    { key: 'created_at', label: 'Created', render: r => r.created_at?.slice(0, 10) },
  ]
  return (
    <div>
      <PageHeader title="Departments" subtitle="Department and domain hierarchy" />
      <div className="bg-white rounded-xl shadow-sm"><Table columns={columns} data={teams} loading={loading} /></div>
    </div>
  )
}
