import { Navigate, Outlet, useLocation } from 'react-router'
import { loginPath } from './paths'
import { useIsLoggedIn } from './session'

export function RequireAuth() {
  const loggedIn = useIsLoggedIn()
  const location = useLocation()

  if (!loggedIn) return <Navigate to={loginPath(location.pathname + location.search)} replace />
  return <Outlet />
}
