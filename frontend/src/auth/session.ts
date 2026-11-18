import Cookies from 'js-cookie'
import { useSyncExternalStore } from 'react'

const ACCESS_COOKIE = 'access'
const REFRESH_COOKIE = 'refresh'

export interface TokenPair {
  access: string
  refresh: string
}

const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach(listener => listener())
}

export function tokenExpiration(token: string): Date | undefined {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return new Date(payload.exp * 1000)
  } catch {
    return undefined
  }
}

function storeToken(name: string, token: string): void {
  Cookies.set(name, token, { expires: tokenExpiration(token), path: '/', sameSite: 'Lax' })
}

export const session = {
  getAccessToken(): string {
    return Cookies.get(ACCESS_COOKIE) ?? ''
  },

  getRefreshToken(): string {
    return Cookies.get(REFRESH_COOKIE) ?? ''
  },

  isLoggedIn(): boolean {
    return Cookies.get(REFRESH_COOKIE) !== undefined
  },

  start({ access, refresh }: TokenPair): void {
    storeToken(ACCESS_COOKIE, access)
    storeToken(REFRESH_COOKIE, refresh)
    notify()
  },

  updateAccessToken(access: string): void {
    storeToken(ACCESS_COOKIE, access)
  },

  end(): void {
    Cookies.remove(ACCESS_COOKIE, { path: '/' })
    Cookies.remove(REFRESH_COOKIE, { path: '/' })
    notify()
  },

  sync(): void {
    if (!session.isLoggedIn()) Cookies.remove(ACCESS_COOKIE, { path: '/' })
    notify()
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useIsLoggedIn(): boolean {
  return useSyncExternalStore(session.subscribe, session.isLoggedIn)
}
