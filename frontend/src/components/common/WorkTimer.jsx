import { Play, Pause, RotateCcw, LogOut, Clock, StopCircle, History } from 'lucide-react'
import useWorkTimer from '../../hooks/useWorkTimer'

const STATE_LABEL = {
  idle:         { text: 'Not Started',  dot: 'bg-gray-400' },
  working:      { text: 'Working',      dot: 'bg-green-500 animate-pulse' },
  paused:       { text: 'On Break',     dot: 'bg-yellow-500' },
  checked_out:  { text: 'Checked Out', dot: 'bg-orange-400' },
  day_ended:    { text: 'Day Ended',    dot: 'bg-blue-500' },
}

export default function WorkTimer() {
  const {
    state, workedDisplay, breakDisplay,
    sessionCount, segments,
    loading, actionLoading, error,
    start, pause, resume, checkout, endDay,
  } = useWorkTimer()

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3 text-gray-400 text-sm">
        <Clock size={18} className="animate-spin" /> Loading timer…
      </div>
    )
  }

  const { text: stateText, dot: dotClass } = STATE_LABEL[state] || STATE_LABEL.idle
  const disabled = actionLoading

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Left — timer display */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-50 flex-shrink-0">
            <Clock size={22} className="text-violet-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stateText}</span>
              {sessionCount > 0 && (
                <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">
                  {sessionCount} session{sessionCount > 1 ? 's' : ''} today
                </span>
              )}
            </div>
            <p className="text-3xl font-mono font-bold text-gray-800 leading-none">{workedDisplay}</p>
            <p className="text-xs text-gray-400 mt-1">
              Break: <span className="font-medium text-gray-500">{breakDisplay}</span>
            </p>
          </div>
        </div>

        {/* Right — controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* idle: first check-in of the day */}
          {state === 'idle' && (
            <TimerBtn onClick={start} disabled={disabled} color="green" icon={Play} label="Start Work" />
          )}

          {/* working: can pause or check out this segment */}
          {state === 'working' && (
            <>
              <TimerBtn onClick={pause}    disabled={disabled} color="yellow" icon={Pause}   label="Break" />
              <TimerBtn onClick={checkout} disabled={disabled} color="red"    icon={LogOut}  label="Check Out" />
            </>
          )}

          {/* paused: resume break or check out */}
          {state === 'paused' && (
            <>
              <TimerBtn onClick={resume}   disabled={disabled} color="green" icon={RotateCcw} label="Resume" />
              <TimerBtn onClick={checkout} disabled={disabled} color="red"   icon={LogOut}   label="Check Out" />
            </>
          )}

          {/* checked_out: start a new segment OR end the day */}
          {state === 'checked_out' && (
            <>
              <TimerBtn onClick={start}  disabled={disabled} color="green" icon={Play}       label="Resume Work" />
              <TimerBtn onClick={endDay} disabled={disabled} color="blue"  icon={StopCircle} label="End Day" />
            </>
          )}

          {/* day_ended: nothing more to do */}
          {state === 'day_ended' && (
            <span className="text-sm text-gray-400 italic">Day complete — see you tomorrow!</span>
          )}
        </div>
      </div>

      {/* Session breakdown */}
      {segments.length > 0 && (
        <div className="border-t pt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
            <History size={13} /> Today’s Sessions
          </div>
          <div className="flex flex-wrap gap-2">
            {segments.map((seg, i) => (
              <div key={seg.id} className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
                <span className="font-medium text-gray-600">#{i + 1}</span>
                <span className="text-gray-400 mx-1">•</span>
                <span className="text-gray-500">
                  {new Date(seg.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {seg.ended_at && (
                    <> → {new Date(seg.ended_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                  )}
                </span>
                {seg.ended_at && (
                  <>
                    <span className="text-gray-400 mx-1">•</span>
                    <span className="font-medium text-violet-600">{seg.duration_display}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  )
}

function TimerBtn({ onClick, disabled, color, icon: Icon, label }) {
  const colors = {
    green:  'bg-green-500 hover:bg-green-600 text-white',
    yellow: 'bg-yellow-400 hover:bg-yellow-500 text-white',
    red:    'bg-red-500 hover:bg-red-600 text-white',
    blue:   'bg-blue-500 hover:bg-blue-600 text-white',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${colors[color]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon size={15} />
      {label}
    </button>
  )
}
