import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'ffm_auth'
const USERS_KEY = 'ffm_registered_users'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed.user)
        setToken(parsed.token)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const persist = (payload) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setUser(payload.user)
    setToken(payload.token)
  }

  const login = async (credentials) => {
    const result = await api.login(credentials)
    persist(result)
    const users = readUsers()
    if (!users.find(u => u.email === result.user.email)) {
      users.push(result.user)
      writeUsers(users)
    }
    return result
  }

  const signup = async (details) => {
    const result = await api.signup(details)
    persist(result)
    const users = readUsers()
    users.push(result.user)
    writeUsers(users)
    return result
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setToken(null)
  }

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: updated }))
    const users = readUsers().map(u => (u.id === updated.id ? updated : u))
    writeUsers(users)
  }

  const getAllUsers = () => readUsers()

  const deleteUser = (id) => {
    const users = readUsers().filter(u => u.id !== id)
    writeUsers(users)
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated: !!token,
      login, signup, logout, updateProfile, getAllUsers, deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
