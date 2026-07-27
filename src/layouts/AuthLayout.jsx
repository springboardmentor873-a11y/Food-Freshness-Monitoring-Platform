import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark bg-graphite-50 dark:bg-graphite-950">
      <Outlet />
    </div>
  )
}
