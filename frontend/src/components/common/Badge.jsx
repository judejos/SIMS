const COLORS = {
  active:       'bg-green-100 text-green-700',
  completed:    'bg-blue-100 text-blue-700',
  terminated:   'bg-red-100 text-red-700',
  pending:      'bg-yellow-100 text-yellow-700',
  in_progress:  'bg-blue-100 text-blue-700',
  present:      'bg-green-100 text-green-700',
  absent:       'bg-red-100 text-red-700',
  late:         'bg-orange-100 text-orange-700',
  half_day:     'bg-purple-100 text-purple-700',
  available:    'bg-green-100 text-green-700',
  assigned:     'bg-blue-100 text-blue-700',
  repair:       'bg-red-100 text-red-700',
  on_hold:      'bg-gray-100 text-gray-700',
  high:         'bg-red-100 text-red-700',
  medium:       'bg-yellow-100 text-yellow-700',
  low:          'bg-green-100 text-green-700',
}

export default function Badge({ value }) {
  const color = COLORS[value] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
      {value?.replace(/_/g, ' ')}
    </span>
  )
}
