import { useEffect, useState } from 'react'

import { useAuth } from '../../app/providers/auth-provider'
import { StatusView } from '../../components/ui/status-view'

export function VerifyPage() {
  const { verifyCurrentToken } = useAuth()
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    void verifyCurrentToken().then(setIsValid)
  }, [verifyCurrentToken])

  if (isValid === null) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <StatusView title="Verifying token" message="Checking whether the current access token is valid." />
      </div>
    )
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4">
      <StatusView
        title={isValid ? 'Session is valid' : 'Session is not valid'}
        message={isValid ? 'The admin access token is active.' : 'Sign in again to restore the admin session.'}
      />
    </div>
  )
}
