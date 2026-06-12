import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createTask } from '../../../services/tasksAPI'
import { getUsers } from '../../../services/usersAPI'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'

export default function CreateTask() {
  const [users, setUsers] = useState([])
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()
  useEffect(() => { getUsers().then(r => setUsers(r.data)) }, [])

  const onSubmit = async (data) => {
    try {
      await createTask(data)
      toast.success('Task created!')
      reset()
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
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" {...register('due_date')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </form>
      </div>
    </div>
  )
}
