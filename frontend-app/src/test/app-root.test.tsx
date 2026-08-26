import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AppRoot } from '../app/AppRoot'

describe('AppRoot', () => {
  it('renders the public shell without a theme toggle', async () => {
    render(<AppRoot />)

    expect(await screen.findByText('Phyo Wai Htoon')).toBeInTheDocument()
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'en' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'my' })).toBeInTheDocument()
    expect(screen.queryByLabelText(/theme/i)).not.toBeInTheDocument()
  })

  it('switches the language toggle', async () => {
    const user = userEvent.setup()
    render(<AppRoot />)

    await screen.findByText('Phyo Wai Htoon')
    await user.click(screen.getByRole('button', { name: 'my' }))

    expect(screen.getByRole('navigation', { name: 'Primary' }).textContent).toMatch(/ပင်မ/)
  })
})
