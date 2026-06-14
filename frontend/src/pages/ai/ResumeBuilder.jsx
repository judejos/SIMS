import { useState, useRef } from 'react'
import { FileText, Sparkles, Upload, FileSignature } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function ResumeBuilder() {
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const fileRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    
    setLoading(true)
    try {
      toast.loading('Parsing resume with AI...', { id: 'resume' })
      const res = await api.post('/ai/resume/parse/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResumeText(res.data.text || '')
      toast.success('Resume parsed successfully!', { id: 'resume' })
    } catch {
      toast.error('Failed to parse resume', { id: 'resume' })
    }
    setLoading(false)
    e.target.value = ''
  }

  const evaluateResume = async () => {
    if (!resumeText.trim()) return toast.error('Please paste or upload resume text first')
    setLoading(true)
    try {
      toast.loading('AI is evaluating your resume...', { id: 'resume' })
      const res = await api.post('/ai/resume/improve/', { resume: resumeText })
      setFeedback(res.data.resume)
      toast.success('Evaluation complete!', { id: 'resume' })
    } catch {
      toast.error('Failed to evaluate resume', { id: 'resume' })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader 
        title="AI Resume Builder" 
        subtitle="Parse, evaluate, and improve your resume using Anthropic's Claude 3.5 Sonnet"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileSignature size={20} className="text-primary-600" />
              Resume Content
            </h3>
            
            <input type="file" ref={fileRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />
            <button 
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Upload size={14} /> Upload File
            </button>
          </div>
          
          <textarea 
            className="flex-1 w-full border border-gray-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
            placeholder="Paste your resume text here, or upload a document to auto-extract text..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          
          <button 
            onClick={evaluateResume}
            disabled={loading || !resumeText}
            className="w-full mt-4 bg-primary-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Sparkles size={18} />
            {loading ? 'Processing...' : 'Evaluate & Improve with AI'}
          </button>
        </div>

        <div className="bg-indigo-50 rounded-xl shadow-sm p-6 border border-indigo-100 h-[600px] overflow-y-auto">
          <h3 className="font-semibold text-indigo-900 flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-indigo-600" />
            AI Suggestions & Feedback
          </h3>
          
          {!feedback ? (
            <div className="h-full flex flex-col items-center justify-center text-center pb-12 opacity-50">
              <Sparkles size={48} className="text-indigo-300 mb-4" />
              <p className="text-indigo-800 font-medium">No feedback yet</p>
              <p className="text-indigo-600 text-sm max-w-xs mt-2">Paste your resume text and click Evaluate to receive personalized, actionable AI feedback.</p>
            </div>
          ) : (
            <div className="prose prose-sm prose-indigo whitespace-pre-wrap text-gray-800">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
