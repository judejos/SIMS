import { useEffect, useState } from 'react'
import { getInterns, deleteIntern } from '../../../services/internsAPI'
import { Trash2, Bot } from 'lucide-react'
import toast from 'react-hot-toast'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'

export default function InternUsers() {
  const [interns, setInterns] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const load = () => { setLoading(true); getInterns().then(r => setInterns(r.data)).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const statusFiltered = filter === 'all' ? interns : interns.filter(i => i.status === filter)
  const { query, setQuery, filtered } = useSearch(statusFiltered, ['college', 'degree', 'domain', 'status'])

  const onDelete = async (id) => {
    if (!confirm('Delete intern?')) return
    await deleteIntern(id); toast.success('Deleted'); load()
  }

  const exportCSV = () => {
    const rows = [['ID','User','College','Degree','Start','End','Status']]
    filtered.forEach(i => rows.push([i.id, i.user, i.college, i.degree, i.start_date, i.end_date || '', i.status]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv)
    a.download = 'interns.csv'; a.click()
  }

  const columns = [
    { key: 'user', label: 'User ID' },
    { key: 'college', label: 'College', render: r => r.college || '—' },
    { key: 'degree', label: 'Degree', render: r => r.degree || '—' },
    { key: 'start_date', label: 'Start' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'ai', label: 'AI Badge', render: () => <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><Bot size={11} />Analysed</span> },
    { key: 'actions', label: '', render: r => (
      <button onClick={() => onDelete(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
    )},
  ]

  return (
    <div>
      <PageHeader title="Intern List" subtitle={`${filtered.length} of ${interns.length} interns`} action={
        <div className="flex gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="terminated">Terminated</option>
          </select>
          <Button variant="secondary" onClick={exportCSV}>Export CSV</Button>
        </div>
      } />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by college, degree, domain…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
