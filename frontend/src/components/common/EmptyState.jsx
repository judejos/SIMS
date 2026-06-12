import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'No records found', subtitle = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox size={40} className="text-gray-300 mb-3" />
      <h3 className="text-base font-semibold text-gray-600">{title}</h3>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
