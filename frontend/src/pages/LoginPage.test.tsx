import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { api } from '../api/client'
import { session } from '../auth/session'
import { fakeJwt, renderRoutes } from '../test/utils'
import { safeReturnUrl } from '../auth/paths'
import LoginPage from './LoginPage'

const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/pets/novo', element: <p>novo pet</p> },
]

describe('LoginPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  afterEach(() => mock.restore())

  async function fill(email: string, password: string): Promise<void> {
    const user = userEvent.setup()
    if (email) await user.type(screen.getByLabelText('E-mail'), email)
    if (password) await user.type(screen.getByLabelText('Senha'), password)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
  }

  it('does not call the API when the form is invalid', async () => {
    renderRoutes(routes, '/login')

    await fill('invalido', '')

    expect(screen.getByLabelText('E-mail')).toHaveClass('is-invalid')
    expect(mock.history.post).toHaveLength(0)
  })

  it('navigates to the return url after logging in', async () => {
    mock.onPost('/auth/obtain/').reply(200, { access: fakeJwt(), refresh: fakeJwt() })
    renderRoutes(routes, '/login?returnUrl=%2Fpets%2Fnovo')

    await fill('ana@pet4lov.com', 'senha-forte')

    expect(await screen.findByText('novo pet')).toBeInTheDocument()
    expect(JSON.parse(mock.history.post[0].data)).toEqual({ email: 'ana@pet4lov.com', password: 'senha-forte' })
    expect(session.isLoggedIn()).toBe(true)
  })

  it('shows a message when the credentials are wrong', async () => {
    mock.onPost('/auth/obtain/').reply(401, { detail: 'No active account' })
    renderRoutes(routes, '/login')

    await fill('ana@pet4lov.com', 'errada')

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha inválidos')
  })

  it('ignores return urls that leave the app', () => {
    expect(safeReturnUrl('//malicioso.com')).toBe('/minha-conta')
    expect(safeReturnUrl('https://malicioso.com')).toBe('/minha-conta')
    expect(safeReturnUrl('/pets/novo')).toBe('/pets/novo')
  })
})
