import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createFeedback, getFeedbacks } from '../../../services/feedbackAPI'
import { getUsers } from '../../../services/usersAPI'
import useAuth from '../../../hooks/useAuth'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import { Star } from 'lucide-react'

export default function StaffFeedback() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [myFeedbacks, setMyFeedbacks] = useState([])
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    Promise.all([getUsers(), getFeedbacks()]).then(([u, f]) => {
      setUsers(u.data.filter(u => u.username !== user?.username))
      setMyFeedbacks(f.data.filter(fb => fb.given_by === user?.id))
    })
  }, [user])

  const onSubmit = async (data) => {
    try {
      await createFeedback({ ...data, given_by: user?.id })
      toast.success('Feedback submitted!'); reset()
      getFeedbacks().then(r => setMyFeedbacks(r.data.filter(fb => fb.given_by === user?.id)))
    } catch { toast.error('Failed to submit') }
  }

  const getName = (id) => users.find(u => u.id === id)?.username || id

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Staff Feedback" subtitle="Submit feedback about your Mentor or Lead" />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
            <select {...register('given_to', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Select mentor / lead</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username} — {u.first_name} {u.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <label key={n} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" value={n} {...register('rating', { required: true })} className="hidden" />
                  <Star size={24} className="text-yellow-400 hover:fill-yellow-400 transition-colors" />
                </label>
              ))}
              <input type="number" min="1" max="5" {...register('rating', { required: true })} className="w-16 border rounded-lg px-2 py-1 text-sm ml-2" placeholder="1-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea {...register('comments')} rows={3} placeholder="Share your experience..." className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </div>
      {myFeedbacks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3">My Submitted Feedback</h3>
          <div className="space-y-3">
            {myFeedbacks.map(f => (
              <div key={f.id} className="border rounded-lg p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">To: {getName(f.given_to)}</span>
                  <span className="text-yellow-500 font-semibold flex items-center gap-1"><Star size={13} fill="currentColor" />{f.rating}/5</span>
                </div>
                {f.comments && <p className="text-gray-500 mt-1">{f.comments}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
