import { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../../services/api'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import toast from 'react-hot-toast'

export default function MyLearningPath() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean)
      const res = await api.post('/ai/learning-path/', { ...data, skills })
      setResult(res.data)
    } catch { toast.error('Failed to generate learning path') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title="My Learning Path" subtitle="AI-powered personalized learning plan" />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
              <input {...register('target_role', { required: true })} placeholder="e.g. Full Stack Developer" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
              <input type="number" defaultValue={12} {...register('duration_weeks')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Skills (comma separated)</label>
            <input {...register('skills')} placeholder="e.g. Python, React, SQL" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Generating...' : 'Generate Learning Path'}
          </Button>
        </form>
      </div>
      {result && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Skill Gaps</h3>
            <div className="flex flex-wrap gap-2">
              {result.skill_gaps?.map(s => <span key={s} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">{s}</span>)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Weekly Plan</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">{result.weekly_plan}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
