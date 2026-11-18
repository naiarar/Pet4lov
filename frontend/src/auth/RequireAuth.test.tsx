import { screen } from '@testing-library/react'
import { useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { fakeJwt, renderRoutes } from '../test/utils'
import { RequireAuth } from './RequireAuth'
import { session } from './session'

function LoginProbe() {
  const location = useLocation()
  return <p>login {location.search}</p>
}

const routes = [
  { element: <RequireAuth />, children: [{ path: '/minha-conta', element: <p>conta</p> }] },
  { path: '/login', element: <LoginProbe /> },
]

describe('RequireAuth', () => {
  it('allows access when logged in', async () => {
    session.start({ access: fakeJwt(), refresh: fakeJwt() })

    renderRoutes(routes, '/minha-conta')

    expect(await screen.findByText('conta')).toBeInTheDocument()
  })

  it('redirects to login keeping the requested url', async () => {
    renderRoutes(routes, '/minha-conta')

    expect(await screen.findByText('login ?returnUrl=%2Fminha-conta')).toBeInTheDocument()
  })
})
