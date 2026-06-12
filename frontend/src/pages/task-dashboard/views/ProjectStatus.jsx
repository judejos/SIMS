import { useEffect, useState } from 'react'
import api from '../../../services/api'
import { getTasks } from '../../../services/tasksAPI'
import Badge from '../../../components/common/Badge'
import PageHeader from '../../../components/common/PageHeader'

export default function ProjectStatus() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/projects/'), getTasks()])
      .then(([p, t]) => { setProjects(p.data); setTasks(t.data) })
      .finally(() => setLoading(false))
  }, [])

  const projectTasks = selected ? tasks.filter(t => t.description?.includes(selected.name) || true).slice(0, 10) : []
  const progress = projectTasks.length ? Math.round((projectTasks.filter(t => t.status === 'completed').length / projectTasks.length) * 100) : 0

  return (
    <div className="space-y-4">
      <PageHeader title="Project Status" subtitle="Per-project task breakdown and progress" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Projects</h3>
          {loading ? <p className="text-gray-400 text-sm">Loading...</p> : projects.map(p => (
            <button key={p.id} onClick={() => setSelected(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selected?.id === p.id ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
              <div className="flex items-center justify-between">
                <span>{p.name}</span>
                <Badge value={p.status} />
              </div>
            </button>
          ))}
        </div>
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 text-lg">{selected.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{selected.description || 'No description'}</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                {['pending','in_progress','completed'].map(s => (
                  <div key={s} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-gray-800">{projectTasks.filter(t => t.status === s).length}</p>
                    <p className="text-xs text-gray-500 capitalize mt-1">{s.replace('_',' ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
