import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { session } from '../auth/session'

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export const api = axios.create({ baseURL: API_URL })

type RetriableConfig = InternalAxiosRequestConfig & { retried?: boolean }

let onSessionExpired: () => void = () => undefined
let refreshing: Promise<string> | null = null

export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler
}

const isAuthRequest = (url = '') => url.includes('/auth/')

export function refreshAccessToken(): Promise<string> {
  refreshing ??= api
    .post<{ access: string }>('/auth/refresh/', { refresh: session.getRefreshToken() })
    .then(({ data }) => {
      session.updateAccessToken(data.access)
      return data.access
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

api.interceptors.request.use(config => {
  const token = session.getAccessToken()
  if (token && !isAuthRequest(config.url)) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetriableConfig | undefined
  if (error.response?.status !== 401 || !config || config.retried || isAuthRequest(config.url)) throw error

  if (!session.isLoggedIn()) {
    session.sync()
    throw error
  }

  config.retried = true
  let token: string
  try {
    token = await refreshAccessToken()
  } catch (refreshError) {
    session.end()
    onSessionExpired()
    throw refreshError
  }
  config.headers.Authorization = `Bearer ${token}`
  return api(config)
})
