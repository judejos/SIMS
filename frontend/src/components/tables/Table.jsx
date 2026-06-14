import EmptyState from '../common/EmptyState'

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  )
}

export default function Table({ columns, data, loading, emptyTitle, emptySubtitle }) {
  if (loading) return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>{columns.map(col => <th key={col.key} className="px-6 py-3 text-left font-medium">{col.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)}
        </tbody>
      </table>
    </div>
  )

  if (!data?.length) return (
    <EmptyState title={emptyTitle || 'No records found'} subtitle={emptySubtitle} />
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-6 py-3 text-left font-medium tracking-wide">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={row.id ?? i} className="hover:bg-gray-50 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] relative z-0 hover:z-10 bg-white">
              {columns.map(col => (
                <td key={col.key} className="px-6 py-3 text-gray-700">
                  {col.render ? col.render(row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
