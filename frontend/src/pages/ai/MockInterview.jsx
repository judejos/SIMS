import { useState, useRef } from 'react'
import { Play, MessageSquare, Award, ChevronRight, Mic, MicOff, Square } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function MockInterview() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  
  // To handle Speech Recognition
  const recognitionRef = useRef(null)

  const startInterview = async () => {
    setLoading(true)
    try {
      const res = await api.post('/ai/interview/start/', { role: 'Software Engineer', type: 'technical' })
      setSession({
        status: 'active',
        role: 'Software Engineer',
        history: [],
        current_question: res.data.question,
        evaluation: null,
      })
      toast.success('Interview started!')
    } catch {
      toast.error('Failed to start interview')
    }
    setLoading(false)
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please provide an answer')
    if (isRecording) stopRecording()
    setLoading(true)
    try {
      const res = await api.post('/ai/interview/evaluate/', { 
        question: session.current_question,
        answer: answer,
        role: session.role
      })
      
      setSession({
        ...session,
        evaluation: res.data,
      })
      toast.success('Answer evaluated!')
    } catch {
      toast.error('Failed to evaluate answer')
    }
    setLoading(false)
  }

  const nextQuestion = async () => {
    setLoading(true)
    const newHistory = [...session.history, { question: session.current_question, answer }]
    
    // Check if we've reached 5 questions, then finish
    if (newHistory.length >= 5) {
      try {
        const res = await api.post('/ai/interview/summary/', { qa_pairs: newHistory, role: session.role })
        toast.success('Interview completed!')
        setSession({ ...session, status: 'completed', summary: res.data.summary, history: newHistory })
      } catch {
        toast.error('Failed to generate summary')
      }
    } else {
      try {
        const res = await api.post('/ai/interview/next/', { 
          role: session.role, 
          type: 'technical',
          history: newHistory
        })
        setSession({ 
          ...session, 
          history: newHistory,
          current_question: res.data.question, 
          evaluation: null 
        })
        setAnswer('')
      } catch {
        toast.error('Failed to load next question')
      }
    }
    setLoading(false)
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsRecording(true)
      toast('Recording started...', { icon: '🎙️' })
    }

    recognition.onresult = (event) => {
      let currentTranscript = ''
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript
      }
      setAnswer(currentTranscript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error)
      if (event.error !== 'aborted') toast.error(`Microphone error: ${event.error}`)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="AI Mock Interview" 
        subtitle="Practice your technical interviews with a realistic AI interviewer"
      />

      {!session ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <MessageSquare size={40} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to practice?</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            The AI will ask you up to 5 technical questions, evaluate your answers in real-time, and provide an overall hiring recommendation.
          </p>
          <button 
            onClick={startInterview}
            disabled={loading}
            className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Play fill="currentColor" size={18} />
            {loading ? 'Starting...' : 'Start Mock Interview'}
          </button>
        </div>
      ) : session.status === 'completed' ? (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
          <Award size={64} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Interview Completed!</h2>
          <p className="text-gray-500 mb-8">Here is your overall performance summary.</p>
          
          <div className="bg-gray-50 rounded-xl p-6 text-left whitespace-pre-wrap text-gray-700 prose max-w-none">
            {session.summary}
          </div>
          
          <button 
            onClick={() => { setSession(null); setAnswer(''); }}
            className="mt-8 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Start New Interview
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="bg-gray-50 p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Interviewer (Question {session.history.length + 1} of 5)</span>
            </div>
            <h3 className="text-xl font-medium text-gray-800">
              {session.current_question}
            </h3>
          </div>
          
          <div className="p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Your Answer</label>
            <div className="relative">
              <textarea 
                rows={6}
                className={`w-full border rounded-xl p-4 pr-12 focus:outline-none resize-none mb-4 transition-colors ${
                  isRecording ? 'border-red-400 ring-2 ring-red-100 bg-red-50/10' : 'border-gray-200 focus:ring-2 focus:ring-primary-500'
                }`}
                placeholder={isRecording ? "Listening... Start speaking..." : "Type your answer here or use the microphone..."}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={session.evaluation != null || loading}
              />
              {isRecording && (
                <span className="absolute top-4 right-4 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>
            
            {!session.evaluation ? (
              <div className="flex justify-between items-center">
                <button 
                  onClick={toggleRecording}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm border ${
                    isRecording 
                      ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {isRecording ? <><Square size={14} fill="currentColor" /> Stop Recording</> : <><Mic size={16} /> Use Voice</>}
                </button>

                <button 
                  onClick={submitAnswer}
                  disabled={loading || !answer.trim()}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 mt-6">
                <h4 className="font-bold text-green-800 mb-2 flex items-center justify-between">
                  AI Feedback 
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">Score: {session.evaluation.score}/10</span>
                </h4>
                <div className="text-green-800 text-sm space-y-3">
                  <p className="whitespace-pre-wrap">{session.evaluation.raw}</p>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={nextQuestion}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {session.history.length === 4 ? 'Finish Interview' : 'Next Question'} <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
