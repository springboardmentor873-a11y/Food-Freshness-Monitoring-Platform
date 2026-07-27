import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-graphite-400">
      <Link to="/dashboard" className="flex items-center hover:text-emerald-600 transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.to ? (
            <Link to={item.to} className="hover:text-emerald-600 transition-colors">{item.label}</Link>
          ) : (
            <span className="font-medium text-graphite-600 dark:text-graphite-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
