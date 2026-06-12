import { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../../services/api'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import toast from 'react-hot-toast'
import { FileText, Wand2 } from 'lucide-react'

export default function ResumeBuilderPage() {
  const [tab, setTab] = useState('generate')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()

  const generate = async (data) => {
    setLoading(true)
    try {
      const skills = data.skills.split(',').map(s => s.trim())
      const { data: res } = await api.post('/ai/resume/generate/', { ...data, skills })
      setResult(res.resume)
    } catch { toast.error('Failed to generate resume') }
    finally { setLoading(false) }
  }

  const improve = async (data) => {
    setLoading(true)
    try {
      const { data: res } = await api.post('/ai/resume/improve/', { resume: data.existing, job_description: data.job_desc })
      setResult(res.resume)
    } catch { toast.error('Failed to improve resume') }
    finally { setLoading(false) }
  }

  const copy = () => { navigator.clipboard.writeText(result); toast.success('Copied!') }

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title="Resume Builder" subtitle="AI-powered resume generator and evaluator" />
      <div className="flex gap-2">
        {['generate', 'improve'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'}`}>
            {t === 'generate' ? '✨ Generate' : '🔧 Improve'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {tab === 'generate' ? (
          <form onSubmit={handleSubmit(generate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...register('name', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                <input {...register('role')} placeholder="e.g. Software Engineer" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input {...register('skills')} placeholder="Python, React, SQL..." className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <input {...register('education')} placeholder="B.Tech Computer Science, IIT..." className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <textarea {...register('experience')} rows={2} placeholder="Internship at XYZ..." className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Projects</label>
              <textarea {...register('projects')} rows={2} placeholder="Built a web app using..." className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <Wand2 size={15} className="inline mr-2" />{loading ? 'Generating...' : 'Generate Resume'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(improve)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paste Your Resume</label>
              <textarea {...register('existing', { required: true })} rows={8} placeholder="Paste your existing resume here..." className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (optional)</label>
              <textarea {...register('job_desc')} rows={3} placeholder="Paste job description to tailor resume..." className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <Wand2 size={15} className="inline mr-2" />{loading ? 'Improving...' : 'Improve Resume'}
            </Button>
          </form>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2"><FileText size={16} />Generated Resume</h3>
            <Button size="sm" variant="secondary" onClick={copy}>Copy</Button>
          </div>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">{result}</pre>
        </div>
      )}
    </div>
  )
}
