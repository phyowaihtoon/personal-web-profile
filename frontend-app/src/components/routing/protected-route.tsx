import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../../app/providers/auth-provider'
import { StatusView } from '../ui/status-view'

export function ProtectedRoute() {
  const { isAuthenticated, isReady } = useAuth()
  const location = useLocation()

  if (!isReady) {
    return <StatusView title="Loading session" message="Checking the current admin session." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}