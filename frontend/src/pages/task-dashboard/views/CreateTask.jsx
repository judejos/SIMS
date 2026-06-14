import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Sparkles, Trash2, Plus } from 'lucide-react'
import { createTask } from '../../../services/tasksAPI'
import { getUsers } from '../../../services/usersAPI'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'

export default function CreateTask() {
  const [users, setUsers] = useState([])
  const [subtasks, setSubtasks] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm()
  const title = watch('title')
  const desc = watch('description')
  
  useEffect(() => { getUsers().then(r => setUsers(r.data)) }, [])

  const addSubtask = () => setSubtasks([...subtasks, { title: '' }])
  const removeSubtask = (i) => setSubtasks(subtasks.filter((_, idx) => idx !== i))
  const handleSubtaskChange = (i, val) => {
    const updated = [...subtasks]
    updated[i].title = val
    setSubtasks(updated)
  }

  const generateAISubtasks = () => {
    if (!title) return toast.error('Please enter a task title first')
    setIsGenerating(true)
    // Mocking an AI response delay
    setTimeout(() => {
      setSubtasks([
        { title: `Research requirements for ${title}` },
        { title: `Draft initial implementation for ${title}` },
        { title: 'Review and testing' }
      ])
      setIsGenerating(false)
      toast.success('AI suggested 3 subtasks!')
    }, 1500)
  }

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, subtasks: subtasks.filter(s => s.title.trim() !== '') }
      await createTask(payload)
      toast.success('Task created!')
      reset()
      setSubtasks([])
    } catch { toast.error('Failed to create task') }
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Create Task" />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input {...register('title', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select {...register('assigned_to')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select {...register('priority')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" {...register('due_date')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SLA Hours (Optional)</label>
              <input type="number" {...register('sla_hours')} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g., 24" />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Subtasks</label>
              <button 
                type="button" 
                onClick={generateAISubtasks}
                disabled={isGenerating}
                className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <Sparkles size={14} />
                {isGenerating ? 'Generating...' : 'Suggest with AI'}
              </button>
            </div>
            
            <div className="space-y-2 mb-2">
              {subtasks.map((st, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input 
                    value={st.title} 
                    onChange={e => handleSubtaskChange(i, e.target.value)} 
                    className="flex-1 border rounded-lg px-3 py-1.5 text-sm" 
                    placeholder="Subtask description"
                  />
                  <button type="button" onClick={() => removeSubtask(i)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addSubtask} className="text-sm text-primary-600 font-medium hover:text-primary-800 flex items-center gap-1">
              <Plus size={14} /> Add Manual Subtask
            </button>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </form>
      </div>
    </div>
  )
}
