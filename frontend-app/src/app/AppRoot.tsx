import { RouterProvider } from 'react-router-dom'

import { AuthProvider } from './providers/auth-provider'
import { LocaleProvider } from './providers/locale-provider'
import { QueryProvider } from './providers/query-provider'
import { ThemeProvider } from './providers/theme-provider'
import { router } from './router'

export function AppRoot() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}