import { useState } from 'react'
import { Send, Bot, AlertTriangle } from 'lucide-react'
import api from '../../../services/api'

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your SIMS AI Assistant. Ask me anything about your internship!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setApiError(null)
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))
      const { data } = await api.post('/ai/chatbot/', { message: userMsg, history })
      setMessages(m => [...m, { role: 'bot', text: data.reply }])
    } catch (e) {
      const errMsg = e.response?.data?.error || 'Failed to get response'
      if (errMsg.includes('GEMINI_API_KEY')) {
        setApiError('Gemini API key is not configured. Add GEMINI_API_KEY to backend/.env')
      } else {
        setMessages(m => [...m, { role: 'bot', text: `Error: ${errMsg}` }])
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Bot size={22} /> AI Assistant</h2>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">AI Not Configured</p>
            <p className="text-sm text-red-600 mt-0.5">{apiError}</p>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
              className="text-xs text-red-500 underline mt-1 block">
              Get your free Gemini API key →
            </a>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2.5 rounded-2xl text-sm text-gray-400 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>
        <div className="border-t p-4 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask anything..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button onClick={send} disabled={loading} className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-50">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
