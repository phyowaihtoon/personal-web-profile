import { RouterProvider } from 'react-router-dom'

import { AuthProvider } from './providers/auth-provider'
import { LocaleProvider } from './providers/locale-provider'
import { QueryProvider } from './providers/query-provider'
import { router } from './router'

export function AppRoot() {
  return (
    <QueryProvider>
      <LocaleProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </LocaleProvider>
    </QueryProvider>
  )
}
