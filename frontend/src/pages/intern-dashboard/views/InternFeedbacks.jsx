import { useEffect, useState } from 'react'
import { getFeedbacks } from '../../../services/feedbackAPI'
import { getUsers } from '../../../services/usersAPI'
import { Star, Bot } from 'lucide-react'
import Table from '../../../components/tables/Table'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import toast from 'react-hot-toast'
import api from '../../../services/api'

export default function InternFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getFeedbacks(), getUsers()])
      .then(([f, u]) => { setFeedbacks(f.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }, [])

  const getName = (id) => users.find(u => u.id === id)?.username || id

  const draftAI = async (feedback) => {
    try {
      const { data } = await api.post('/ai/chatbot/', {
        message: `Draft a professional performance feedback for an intern with rating ${feedback.rating}/5. Comments: "${feedback.comments}". Make it constructive and encouraging.`
      })
      toast.success('AI draft ready!')
      alert(data.reply)
    } catch { toast.error('AI unavailable') }
  }

  const columns = [
    { key: 'given_by', label: 'From', render: r => getName(r.given_by) },
    { key: 'given_to', label: 'To', render: r => getName(r.given_to) },
    { key: 'rating', label: 'Rating', render: r => (
      <span className="flex items-center gap-1 text-yellow-500 font-semibold"><Star size={13} fill="currentColor" />{r.rating}/5</span>
    )},
    { key: 'comments', label: 'Comments', render: r => r.comments || '—' },
    { key: 'created_at', label: 'Date', render: r => r.created_at?.slice(0, 10) },
    { key: 'ai', label: '', render: r => (
      <Button size="sm" variant="secondary" onClick={() => draftAI(r)}><Bot size={13} className="inline mr-1" />AI Draft</Button>
    )},
  ]

  return (
    <div>
      <PageHeader title="Feedback List" subtitle="All intern feedback submissions" />
      <div className="bg-white rounded-xl shadow-sm"><Table columns={columns} data={feedbacks} loading={loading} /></div>
    </div>
  )
}
