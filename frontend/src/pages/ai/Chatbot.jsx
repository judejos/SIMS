import { useState } from 'react'
import { Send, Bot } from 'lucide-react'

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your SIMS AI assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages(m => [...m, { role: 'user', text: input }, { role: 'bot', text: 'This feature is coming soon with full AI integration.' }])
    setInput('')
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Bot size={24} /> AI Chatbot</h1>
      <div className="bg-white rounded-xl shadow-sm flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button onClick={send} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
