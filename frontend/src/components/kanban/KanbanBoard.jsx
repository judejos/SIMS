import { useState } from 'react'
import { MoreHorizontal, Clock, AlertCircle } from 'lucide-react'
import Badge from '../common/Badge'

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 border-gray-200' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
  { id: 'completed', title: 'Completed', color: 'bg-green-50 border-green-200' },
  { id: 'verified', title: 'Verified', color: 'bg-purple-50 border-purple-200' }
]

export default function KanbanBoard({ tasks, onEdit, users }) {
  const getName = (id) => users.find(u => u.id === id)?.username || '—'

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 items-start">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id)
        return (
          <div key={col.id} className={`flex-shrink-0 w-80 rounded-xl border ${col.color} flex flex-col max-h-[70vh]`}>
            <div className="p-3 border-b border-inherit flex items-center justify-between bg-white/50 rounded-t-xl">
              <h3 className="font-semibold text-gray-700">{col.title}</h3>
              <span className="bg-white text-gray-500 text-xs font-bold px-2 py-1 rounded-full shadow-sm">{colTasks.length}</span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {colTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => onEdit(task)}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge value={task.priority} />
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  <h4 className="font-medium text-gray-800 mb-1 leading-tight">{task.title}</h4>
                  
                  {task.project && (
                    <p className="text-xs text-gray-500 mb-3 truncate">Project #{task.project}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
                      <div className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-[10px] uppercase font-bold">
                        {getName(task.assigned_to).substring(0, 2)}
                      </div>
                      <span className="truncate max-w-[80px]">{getName(task.assigned_to)}</span>
                    </div>
                    
                    {task.due_date && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} />
                        {task.due_date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {colTasks.length === 0 && (
                <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
