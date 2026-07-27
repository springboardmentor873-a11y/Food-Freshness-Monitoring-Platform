export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-4 w-full rounded-md ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="skeleton h-8 w-8 rounded-lg" />
      <div className="skeleton h-6 w-2/3 rounded-md" />
      <div className="skeleton h-4 w-1/2 rounded-md" />
    </div>
  )
}

export function SkeletonTableRow({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 w-full rounded-md" />
        </td>
      ))}
    </tr>
  )
}
