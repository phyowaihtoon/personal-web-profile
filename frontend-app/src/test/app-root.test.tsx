import { render, screen } from '@testing-library/react'

import { AppRoot } from '../app/AppRoot'

describe('AppRoot', () => {
  it('renders the public shell', async () => {
    render(<AppRoot />)

    expect(await screen.findByText(/Personal Website Platform|ကိုယ်ပိုင်ဝဘ်ဆိုက်စနစ်/)).toBeInTheDocument()
  })
})