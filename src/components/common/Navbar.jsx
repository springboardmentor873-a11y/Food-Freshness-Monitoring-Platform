import { Menu, Moon, Sun } from 'lucide-react'
import SearchBar from './SearchBar.jsx'
import NotificationDropdown from './NotificationDropdown.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'
import { useTheme } from '../../hooks/useTheme.js'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Navbar({ onMenuClick, pageTitle }) {
  const { theme, toggleTheme } = useTheme()
  const [query, setQuery] = useState('')

  const handleSearch = (val) => {
    setQuery(val)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) toast(`Searching "${query}" across inventory, reports & pages...`, { icon: '🔎' })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-graphite-200/60 bg-white/70 backdrop-blur-xl dark:border-graphite-800 dark:bg-graphite-900/60">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-graphite-500 hover:bg-graphite-100 dark:hover:bg-graphite-800 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden lg:block">
          <h1 className="font-display text-lg font-bold text-graphite-800 dark:text-white">{pageTitle}</h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="ml-auto hidden max-w-sm flex-1 md:block">
          <SearchBar value={query} onChange={handleSearch} placeholder="Search inventory, reports, foods..." />
        </form>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-graphite-500 hover:bg-graphite-100 dark:text-graphite-300 dark:hover:bg-graphite-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <NotificationDropdown />
          <div className="h-6 w-px bg-graphite-200 dark:bg-graphite-700" />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}
