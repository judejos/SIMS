import { useEffect, useState } from 'react'
import { getTasks } from '../../../services/tasksAPI'
import { getUsers } from '../../../services/usersAPI'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import api from '../../../services/api'
import toast from 'react-hot-toast'
import { Bot } from 'lucide-react'

export default function IndividualTask() {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState(null)
  const [aiExplain, setAiExplain] = useState('')
  const [explaining, setExplaining] = useState(false)

  useEffect(() => {
    Promise.all([getTasks(), getUsers()]).then(([t, u]) => { setTasks(t.data); setUsers(u.data) })
  }, [])

  const getName = (id) => users.find(u => u.id === id)?.username || '—'

  const explain = async () => {
    if (!selected) return
    setExplaining(true)
    try {
      const { data } = await api.post('/ai/chatbot/', {
        message: `Explain this task in simple terms and suggest how to approach it: Title: "${selected.title}". Description: "${selected.description || 'No description'}". Priority: ${selected.priority}. Due: ${selected.due_date || 'No due date'}.`
      })
      setAiExplain(data.reply)
    } catch { toast.error('AI unavailable') }
    finally { setExplaining(false) }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Task Deep Dive" subtitle="Select a task to view details" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-1 overflow-y-auto max-h-[500px]">
          <h3 className="font-semibold text-gray-700 text-sm mb-3">All Tasks</h3>
          {tasks.map(t => (
            <button key={t.id} onClick={() => { setSelected(t); setAiExplain('') }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selected?.id === t.id ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
              {t.title}
            </button>
          ))}
        </div>
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-gray-800 text-lg">{selected.title}</h3>
                <Badge value={selected.status} />
              </div>
              <p className="text-gray-600 text-sm">{selected.description || 'No description provided.'}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Assigned To:</span> <span className="font-medium">{getName(selected.assigned_to)}</span></div>
                <div><span className="text-gray-500">Assigned By:</span> <span className="font-medium">{getName(selected.assigned_by)}</span></div>
                <div><span className="text-gray-500">Priority:</span> <Badge value={selected.priority} /></div>
                <div><span className="text-gray-500">Due Date:</span> <span className="font-medium">{selected.due_date || '—'}</span></div>
              </div>
              <Button onClick={explain} disabled={explaining} variant="secondary">
                <Bot size={15} className="inline mr-1" />{explaining ? 'Explaining...' : 'AI Explain'}
              </Button>
              {aiExplain && (
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">{aiExplain}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
