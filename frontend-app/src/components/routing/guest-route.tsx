import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../../app/providers/auth-provider'
import { StatusView } from '../ui/status-view'

export function GuestRoute() {
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return <StatusView title="Loading session" message="Preparing authentication state." />
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}