import { describe, expect, it, vi } from 'vitest'
import { fakeJwt } from '../test/utils'
import { session, tokenExpiration } from './session'

describe('session', () => {
  it('stores the tokens and notifies subscribers when it starts', () => {
    const listener = vi.fn()
    const unsubscribe = session.subscribe(listener)
    const access = fakeJwt(1800)

    session.start({ access, refresh: fakeJwt(86400) })

    expect(session.getAccessToken()).toBe(access)
    expect(session.isLoggedIn()).toBe(true)
    expect(listener).toHaveBeenCalledOnce()
    unsubscribe()
  })

  it('clears the tokens when it ends', () => {
    session.start({ access: fakeJwt(), refresh: fakeJwt() })

    session.end()

    expect(session.getAccessToken()).toBe('')
    expect(session.isLoggedIn()).toBe(false)
  })

  it('drops the access token and notifies when the refresh cookie is gone', () => {
    session.start({ access: fakeJwt(), refresh: fakeJwt() })
    document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    const listener = vi.fn()
    const unsubscribe = session.subscribe(listener)

    session.sync()

    expect(session.getAccessToken()).toBe('')
    expect(listener).toHaveBeenCalledOnce()
    unsubscribe()
  })

  it('reads the expiration from the token payload', () => {
    expect(tokenExpiration(fakeJwt(60))!.getTime()).toBeGreaterThan(Date.now())
    expect(tokenExpiration('invalido')).toBeUndefined()
  })
})
