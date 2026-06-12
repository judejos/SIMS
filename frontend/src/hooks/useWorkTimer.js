import { useState, useEffect, useRef, useCallback } from 'react'
import { timerToday, timerStart, timerPause, timerResume, timerCheckout, timerEndDay } from '../services/attendanceAPI'

const SYNC_INTERVAL_MS = 30_000

function secsToHMS(secs) {
  const s = Math.max(0, secs)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':')
}

const ACTIVE_STATES = ['working', 'paused']

export default function useWorkTimer() {
  const [session, setSession]      = useState(null)
  const [elapsed, setElapsed]      = useState(0)
  const [breakElapsed, setBreak]   = useState(0)
  const [loading, setLoading]      = useState(true)
  const [actionLoading, setAction] = useState(false)
  const [error, setError]          = useState(null)

  const tickRef    = useRef(null)
  const syncRef    = useRef(null)
  const sessionRef = useRef(null)

  useEffect(() => { sessionRef.current = session }, [session])

  const applySession = useCallback((s) => {
    setSession(s)
    setElapsed(s.active_worked_seconds)
    setBreak(s.active_break_seconds)
  }, [])

  const startTick = useCallback(() => {
    clearInterval(tickRef.current)
    tickRef.current = setInterval(() => {
      const s = sessionRef.current
      if (!s) return
      if (s.state === 'working') setElapsed(prev => prev + 1)
      else if (s.state === 'paused') setBreak(prev => prev + 1)
    }, 1000)
  }, [])

  const stopTick = useCallback(() => clearInterval(tickRef.current), [])

  const startSync = useCallback(() => {
    clearInterval(syncRef.current)
    syncRef.current = setInterval(async () => {
      try { const { data } = await timerToday(); applySession(data) } catch { /* silent */ }
    }, SYNC_INTERVAL_MS)
  }, [applySession])

  const stopSync = useCallback(() => clearInterval(syncRef.current), [])

  useEffect(() => {
    timerToday()
      .then(({ data }) => {
        applySession(data)
        if (ACTIVE_STATES.includes(data.state)) { startTick(); startSync() }
      })
      .catch(() => setError('Failed to load timer.'))
      .finally(() => setLoading(false))
    return () => { stopTick(); stopSync() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const withAction = useCallback(async (apiFn) => {
    setAction(true)
    setError(null)
    try {
      const { data } = await apiFn()
      applySession(data)
      if (ACTIVE_STATES.includes(data.state)) { startTick(); startSync() }
      else { stopTick(); stopSync() }
      return data
    } catch (e) {
      setError(e.response?.data?.detail || e.response?.data?.[0] || 'Action failed.')
    } finally {
      setAction(false)
    }
  }, [applySession, startTick, startSync, stopTick, stopSync])

  return {
    session,
    state:          session?.state ?? 'idle',
    workedDisplay:  secsToHMS(elapsed),
    breakDisplay:   secsToHMS(breakElapsed),
    workedSeconds:  elapsed,
    breakSeconds:   breakElapsed,
    sessionCount:   session?.session_count ?? 0,
    segments:       session?.segments ?? [],
    loading,
    actionLoading,
    error,
    start:    () => withAction(timerStart),
    pause:    () => withAction(timerPause),
    resume:   () => withAction(timerResume),
    checkout: () => withAction(timerCheckout),
    endDay:   () => withAction(timerEndDay),
  }
}
