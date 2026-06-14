import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2, Star } from 'lucide-react'
import { getFeedbacks, createFeedback, deleteFeedback } from '../../services/feedbackAPI'
import { getUsers } from '../../services/usersAPI'
import Table from '../../components/tables/Table'
import ConfirmModal from '../../components/modals/ConfirmModal'
import Modal from '../../components/modals/Modal'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'

export default function PerformanceFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const load = () => {
    setLoading(true)
    Promise.all([getFeedbacks(), getUsers()])
      .then(([f, u]) => { setFeedbacks(f.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const getName = (id) => users.find(u => u.id === id)?.username || id
  const onSubmit = async (data) => {
    try { await createFeedback(data); toast.success('Feedback submitted!'); setModal(false); reset(); load() }
    catch { toast.error('Failed') }
  }
  const executeDelete = async (id) => {
    await deleteFeedback(id); toast.success('Deleted'); load()
  }

  const columns = [
    { key: 'given_by', label: 'From', render: r => getName(r.given_by) },
    { key: 'given_to', label: 'To', render: r => getName(r.given_to) },
    { key: 'rating', label: 'Rating', render: r => (
      <span className="flex items-center gap-1 text-yellow-500 font-semibold">
        <Star size={14} fill="currentColor" />{r.rating}/5
      </span>
    )},
    { key: 'comments', label: 'Comments', render: r => r.comments || '—' },
    { key: 'created_at', label: 'Date', render: r => r.created_at?.slice(0, 10) },
    { key: 'actions', label: '', render: r => (
      <button onClick={() => setDeletingId(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
    )},
  ]

  return (
    <div>
      <PageHeader title="Performance Feedback" subtitle="All feedback submissions" action={<Button onClick={() => setModal(true)}><Plus size={15} className="inline mr-1" />Add Feedback</Button>} />
      <div className="bg-white rounded-xl shadow-sm"><Table columns={columns} data={feedbacks} loading={loading} /></div>
      
      <ConfirmModal 
        open={!!deletingId} 
        onClose={() => setDeletingId(null)} 
        onConfirm={() => executeDelete(deletingId)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
      <Modal open={modal} onClose={() => setModal(false)} title="Submit Feedback">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select {...register('given_by', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select {...register('given_to', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
            <input type="number" min="1" max="5" {...register('rating', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea {...register('comments')} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
