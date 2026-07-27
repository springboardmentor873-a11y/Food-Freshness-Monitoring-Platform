import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search anything...', className = '' }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-graphite-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9 pr-8"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 text-graphite-400 hover:text-graphite-600">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
