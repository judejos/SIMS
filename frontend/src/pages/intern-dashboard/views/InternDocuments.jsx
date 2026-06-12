import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import api from '../../../services/api'
import Table from '../../../components/tables/Table'
import Modal from '../../../components/modals/Modal'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import SearchBar from '../../../components/common/SearchBar'
import useSearch from '../../../hooks/useSearch'

export default function InternDocuments() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()
  const { query, setQuery, filtered } = useSearch(docs, ['title', 'document_type', 'status'])

  const load = () => { setLoading(true); api.get('/documents/').then(r => setDocs(r.data)).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const onSubmit = async (data) => {
    const form = new FormData()
    form.append('title', data.title)
    form.append('file', data.file[0])
    try { await api.post('/documents/', form, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Uploaded!'); setModal(false); reset(); load() }
    catch { toast.error('Upload failed') }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete?')) return
    await api.delete(`/documents/${id}/`); toast.success('Deleted'); load()
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'document_type', label: 'Type', render: r => r.document_type || '—' },
    { key: 'status', label: 'Status', render: r => r.status || '—' },
    { key: 'uploaded_by', label: 'Uploaded By' },
    { key: 'uploaded_at', label: 'Date', render: r => r.uploaded_at?.slice(0, 10) },
    { key: 'actions', label: '', render: r => (
      <button onClick={() => onDelete(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
    )},
  ]

  return (
    <div>
      <PageHeader title="Documents" subtitle={`${filtered.length} of ${docs.length} documents`} action={<Button onClick={() => setModal(true)}><Plus size={15} className="inline mr-1" />Upload</Button>} />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by title, type, status…" className="max-w-sm" />
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Upload Document">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input {...register('title', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
            <input type="file" {...register('file', { required: true })} className="w-full text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">Upload</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
