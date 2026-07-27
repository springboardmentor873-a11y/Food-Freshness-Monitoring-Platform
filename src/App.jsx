import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes.jsx'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const { theme } = useTheme()
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-card',
          style: {
            background: theme === 'dark' ? 'rgba(28,32,36,0.9)' : 'rgba(255,255,255,0.9)',
            color: theme === 'dark' ? '#f5f6f7' : '#1c2024',
            borderRadius: '1rem',
            border: '1px solid rgba(24,160,106,0.2)'
          },
          success: { iconTheme: { primary: '#18a06a', secondary: '#fff' } }
        }}
      />
      <AppRoutes />
    </>
  )
}
