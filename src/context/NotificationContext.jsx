import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as api from '../services/api'
import { generateInventory } from '../data/mockData'

const NotificationContext = createContext(null)
const READ_KEY = 'ffm_read_notifications'

function readReadIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY)) || [])
  } catch {
    return new Set()
  }
}

function persistReadIds(set) {
  localStorage.setItem(READ_KEY, JSON.stringify(Array.from(set)))
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [readIds, setReadIds] = useState(readReadIds())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const inventory = generateInventory(48)
      const data = await api.getNotifications(inventory)
      setNotifications(data)
      setLoading(false)
    })()
  }, [])

  const markAsRead = useCallback((id) => {
    setReadIds(prev => {
      const next = new Set(prev)
      next.add(id)
      persistReadIds(next)
      return next
    })
  }, [])

  const markAllAsRead = useCallback(() => {
    setReadIds(prev => {
      const next = new Set(prev)
      notifications.forEach(n => next.add(n.id))
      persistReadIds(next)
      return next
    })
  }, [notifications])

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length

  return (
    <NotificationContext.Provider value={{
      notifications, loading, readIds, markAsRead, markAllAsRead, unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
