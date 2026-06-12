import { useEffect, useState } from 'react'
import api from '../../../services/api'
import Table from '../../../components/tables/Table'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'
import toast from 'react-hot-toast'

export default function ApprovalDashboard() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const { query, setQuery, filtered } = useSearch(docs, ['title', 'document_type', 'status'])

  useEffect(() => { api.get('/documents/').then(r => setDocs(r.data)).finally(() => setLoading(false)) }, [])

  const columns = [
    { key: 'title', label: 'Document' },
    { key: 'document_type', label: 'Type', render: r => r.document_type || '—' },
    { key: 'uploaded_by', label: 'Uploaded By' },
    { key: 'uploaded_at', label: 'Date', render: r => r.uploaded_at?.slice(0, 10) },
    { key: 'actions', label: 'Action', render: r => (
      <div className="flex gap-2">
        <Button size="sm" variant="success" onClick={() => toast.success('Approved!')}>Approve</Button>
        <Button size="sm" variant="danger" onClick={() => toast.error('Rejected!')}>Reject</Button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Approval Dashboard" subtitle={`${filtered.length} of ${docs.length} documents`} />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by title, type, status…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
