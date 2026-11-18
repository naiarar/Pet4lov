import type { NewUser, User } from '../shared/types'
import { api } from './client'

export async function registerUser(user: NewUser): Promise<User> {
  const { data } = await api.post<User>('/register/', user)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/usuarios/me/')
  return data
}
