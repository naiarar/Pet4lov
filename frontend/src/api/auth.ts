import { session, type TokenPair } from '../auth/session'
import { api } from './client'
import { queryClient } from './queryClient'

export async function login(email: string, password: string): Promise<void> {
  const { data } = await api.post<TokenPair>('/auth/obtain/', { email, password })
  queryClient.clear()
  session.start(data)
}

export function logout(): void {
  session.end()
  queryClient.clear()
}
