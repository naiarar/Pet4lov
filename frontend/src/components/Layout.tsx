import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useMatches, useNavigate } from 'react-router'
import { logout } from '../api/auth'
import { setSessionExpiredHandler } from '../api/client'
import { queryClient } from '../api/queryClient'
import { loginPath } from '../auth/paths'
import { useIsLoggedIn } from '../auth/session'

const DEFAULT_TITLE = 'Pet4lov | Encontre seu amor'
const CURRENT_YEAR = new Date().getFullYear()

function usePageTitle(): string {
  const matches = useMatches()
  const handle = matches.at(-1)?.handle as { title?: string } | undefined
  return handle?.title ?? DEFAULT_TITLE
}

const navLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav-link active' : 'nav-link')

export function Layout() {
  const loggedIn = useIsLoggedIn()
  const navigate = useNavigate()
  const location = useLocation()
  const title = usePageTitle()
  const [openAt, setOpenAt] = useState<string | null>(null)
  const menuOpen = openAt === location.key

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    setSessionExpiredHandler(() => {
      queryClient.clear()
      navigate(loginPath(window.location.pathname + window.location.search))
    })
  }, [navigate])

  function handleLogout(): void {
    logout()
    navigate('/pets')
  }

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">
              🐾 Pet4lov
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              aria-controls="main-nav"
              aria-expanded={menuOpen}
              aria-label="Abrir menu"
              onClick={() => setOpenAt(menuOpen ? null : location.key)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="main-nav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink className={navLinkClass} to="/pets" end>
                    Pets
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={navLinkClass} to="/ongs" end>
                    ONGs
                  </NavLink>
                </li>
              </ul>

              <ul className="navbar-nav">
                {loggedIn ? (
                  <>
                    <li className="nav-item">
                      <NavLink className={navLinkClass} to="/minha-conta">
                        Minha conta
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <button type="button" className="btn btn-link nav-link" onClick={handleLogout}>
                        Sair
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink className={navLinkClass} to="/login">
                        Entrar
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <Link className="btn btn-primary ms-md-2" to="/cadastro">
                        Criar conta
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="py-4">
        <Outlet />
      </main>

      <footer className="border-top py-3 text-center text-body-secondary small">
        Pet4lov © {CURRENT_YEAR} · Conectando ONGs e adotantes
      </footer>
    </>
  )
}
