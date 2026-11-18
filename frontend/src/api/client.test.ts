import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { session } from '../auth/session'
import { fakeJwt } from '../test/utils'
import { api, setSessionExpiredHandler } from './client'

describe('api client', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  afterEach(() => {
    mock.restore()
    setSessionExpiredHandler(() => undefined)
  })

  function login(access = fakeJwt()): void {
    session.start({ access, refresh: fakeJwt(86400) })
  }

  it('does not send an Authorization header when logged out', async () => {
    mock.onGet('/pets/').reply(200, [])

    await api.get('/pets/')

    expect(mock.history.get[0].headers?.Authorization).toBeUndefined()
  })

  it('sends the access token when logged in', async () => {
    const access = fakeJwt()
    login(access)
    mock.onGet('/pets/').reply(200, [])

    await api.get('/pets/')

    expect(mock.history.get[0].headers?.Authorization).toBe(`Bearer ${access}`)
  })

  it('refreshes the token and retries once on 401', async () => {
    login()
    const renewed = fakeJwt(3600)
    mock.onGet('/pets/').replyOnce(401).onGet('/pets/').replyOnce(200, ['ok'])
    mock.onPost('/auth/refresh/').replyOnce(200, { access: renewed })

    const { data } = await api.get('/pets/')

    expect(data).toEqual(['ok'])
    expect(mock.history.get[1].headers?.Authorization).toBe(`Bearer ${renewed}`)
    expect(session.getAccessToken()).toBe(renewed)
  })

  it('refreshes only once when several requests get 401 at the same time', async () => {
    login()
    mock.onGet('/pets/').replyOnce(401).onGet('/ongs/').replyOnce(401)
    mock.onGet('/pets/').replyOnce(200, []).onGet('/ongs/').replyOnce(200, [])
    mock.onPost('/auth/refresh/').reply(200, { access: fakeJwt() })

    await Promise.all([api.get('/pets/'), api.get('/ongs/')])

    expect(mock.history.post.filter(request => request.url === '/auth/refresh/')).toHaveLength(1)
  })

  it('logs out and calls the expired handler when the refresh fails', async () => {
    login()
    const onExpired = vi.fn()
    setSessionExpiredHandler(onExpired)
    mock.onGet('/pets/').reply(401)
    mock.onPost('/auth/refresh/').reply(401)

    await expect(api.get('/pets/')).rejects.toBeDefined()

    expect(session.isLoggedIn()).toBe(false)
    expect(onExpired).toHaveBeenCalledOnce()
  })

  it('updates the login state without refreshing when the session is already gone', async () => {
    login()
    document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    const listener = vi.fn()
    const unsubscribe = session.subscribe(listener)
    mock.onGet('/pets/').reply(401)

    await expect(api.get('/pets/')).rejects.toBeDefined()

    expect(listener).toHaveBeenCalled()
    expect(mock.history.post).toHaveLength(0)
    unsubscribe()
  })
})
