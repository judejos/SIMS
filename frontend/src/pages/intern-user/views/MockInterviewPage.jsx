import { useState } from 'react'
import api from '../../../services/api'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import toast from 'react-hot-toast'
import { Mic, CheckCircle } from 'lucide-react'

export default function MockInterviewPage() {
  const [role, setRole] = useState('Software Engineer')
  const [type, setType] = useState('technical')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)

  const start = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/ai/interview/start/', { role, type })
      setQuestion(data.question); setStarted(true); setEvaluation(null); setAnswer('')
    } catch { toast.error('Failed to start interview') }
    finally { setLoading(false) }
  }

  const submit = async () => {
    if (!answer.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post('/ai/interview/evaluate/', { question, answer, role })
      setEvaluation(data)
      setHistory(h => [...h, { question, answer, score: data.score }])
    } catch { toast.error('Evaluation failed') }
    finally { setLoading(false) }
  }

  const next = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/ai/interview/next/', { role, type, history })
      setQuestion(data.question); setAnswer(''); setEvaluation(null)
    } catch { toast.error('Failed to get next question') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title="Mock Interview" subtitle="AI-powered interview practice" />
      {!started ? (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
              <input value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="hr">HR</option>
              </select>
            </div>
          </div>
          <Button onClick={start} disabled={loading} className="w-full">
            <Mic size={16} className="inline mr-2" />{loading ? 'Starting...' : 'Start Interview'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">Q</div>
              <p className="text-gray-800 font-medium leading-relaxed">{question}</p>
            </div>
          </div>
          {!evaluation && (
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
              <label className="block text-sm font-medium text-gray-700">Your Answer</label>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={5} placeholder="Type your answer here..." className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <Button onClick={submit} disabled={loading || !answer.trim()} className="w-full">
                {loading ? 'Evaluating...' : 'Submit Answer'}
              </Button>
            </div>
          )}
          {evaluation && (
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                <span className="font-semibold text-gray-800">Score: {evaluation.score}/10</span>
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-green-50 rounded-lg p-3"><p className="font-medium text-green-700 mb-1">Strengths</p><p className="text-gray-700">{evaluation.strengths}</p></div>
                <div className="bg-yellow-50 rounded-lg p-3"><p className="font-medium text-yellow-700 mb-1">Improvements</p><p className="text-gray-700">{evaluation.improvements}</p></div>
                {evaluation.model_answer && <div className="bg-blue-50 rounded-lg p-3"><p className="font-medium text-blue-700 mb-1">Model Answer</p><p className="text-gray-700">{evaluation.model_answer}</p></div>}
              </div>
              <Button onClick={next} disabled={loading} className="w-full">{loading ? 'Loading...' : 'Next Question →'}</Button>
            </div>
          )}
          {history.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-700 text-sm mb-2">Session Progress ({history.length} questions)</h3>
              <div className="flex gap-2 flex-wrap">
                {history.map((h, i) => (
                  <span key={i} className={`px-2 py-1 rounded-full text-xs font-medium ${h.score >= 7 ? 'bg-green-100 text-green-700' : h.score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    Q{i+1}: {h.score}/10
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
