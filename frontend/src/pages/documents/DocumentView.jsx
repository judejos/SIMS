import { useEffect, useState, useRef } from 'react'
import ConfirmModal from '../../components/modals/ConfirmModal'
import toast from 'react-hot-toast'
import { Upload, FileText, Download, Trash2, CheckCircle, XCircle } from 'lucide-react'
import api from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import Badge from '../../components/common/Badge'

export default function DocumentView() {
  const [documents, setDocuments] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/documents/')
      setDocuments(res.data)
    } catch {
      toast.error('Failed to load documents')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', file.name)
    formData.append('document_type', 'other') // default

    try {
      toast.loading('Uploading document...', { id: 'upload' })
      await api.post('/documents/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Document uploaded successfully!', { id: 'upload' })
      load()
    } catch {
      toast.error('Failed to upload document', { id: 'upload' })
    }
    e.target.value = ''
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
      await api.delete(`/documents/${id}/`)
      toast.success('Document deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader 
        title="My Documents" 
        subtitle="Upload and manage your files" 
        action={
          <div>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Upload size={18} />
              Upload Document
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center p-12 text-gray-400">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FileText size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No documents found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Upload your resume, certificates, or task reports to have them reviewed by your manager.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileText size={24} />
                </div>
                <Badge value={doc.status} />
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-1 truncate" title={doc.title}>{doc.title}</h4>
              <p className="text-xs text-gray-500 mb-4 capitalize">Type: {doc.document_type.replace('_', ' ')}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                
                <div className="flex gap-2">
                  <a href={doc.file} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors" title="Download">
                    <Download size={16} />
                  </a>
                  <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
