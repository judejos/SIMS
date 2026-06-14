import { useState, useEffect } from 'react'
import { Play, Square, Clock } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AttendanceTimer() {
  const [status, setStatus] = useState('absent') // absent, present, finished
  const [checkInTime, setCheckInTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch today's attendance status
  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await api.get('/attendance/my-today/')
        if (res.data) {
          if (res.data.check_in && !res.data.check_out) {
            setStatus('present')
            setCheckInTime(new Date(res.data.date + 'T' + res.data.check_in))
          } else if (res.data.check_in && res.data.check_out) {
            setStatus('finished')
          }
        }
      } catch (e) {
        // No record today
      }
    }
    fetchToday()
  }, [])

  // Timer tick
  useEffect(() => {
    let interval
    if (status === 'present' && checkInTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((new Date() - checkInTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status, checkInTime])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const handleCheckIn = async () => {
    setLoading(true)
    try {
      const now = new Date()
      await api.post('/attendance/', {
        date: now.toISOString().split('T')[0],
        check_in: now.toTimeString().split(' ')[0],
        status: 'present',
        user: 1 // backend should override this with request.user
      })
      setStatus('present')
      setCheckInTime(now)
      setElapsed(0)
      toast.success('Checked In successfully!')
    } catch (e) {
      toast.error('Failed to check in')
    }
    setLoading(false)
  }

  const handleCheckOut = async () => {
    setLoading(true)
    try {
      const now = new Date()
      // Needs to fetch today's ID to patch it, or use a custom endpoint
      await api.post('/attendance/checkout/', {
        check_out: now.toTimeString().split(' ')[0]
      })
      setStatus('finished')
      toast.success('Checked Out successfully!')
    } catch (e) {
      toast.error('Failed to check out')
    }
    setLoading(false)
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="absolute -right-6 -top-6 opacity-10">
        <Clock size={120} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="font-medium text-indigo-100 mb-1">Today's Shift</h3>
        <div className="text-4xl font-bold font-mono tracking-wider mb-6">
          {status === 'present' ? formatTime(elapsed) : status === 'finished' ? 'SHIFT ENDED' : '00:00:00'}
        </div>
        
        {status === 'absent' && (
          <button 
            onClick={handleCheckIn} 
            disabled={loading}
            className="flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors disabled:opacity-70 shadow-md"
          >
            <Play fill="currentColor" size={18} />
            Check In
          </button>
        )}
        
        {status === 'present' && (
          <button 
            onClick={handleCheckOut} 
            disabled={loading}
            className="flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition-colors disabled:opacity-70 shadow-md border-2 border-red-400"
          >
            <Square fill="currentColor" size={18} />
            Check Out
          </button>
        )}
        
        {status === 'finished' && (
          <div className="bg-white/20 px-6 py-2 rounded-full font-medium">
            Great job today!
          </div>
        )}
      </div>
    </div>
  )
}
