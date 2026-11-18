import type { Ong, OngPayload } from '../shared/types'
import { api } from './client'

export async function listOngs(search = ''): Promise<Ong[]> {
  const { data } = await api.get<Ong[]>('/ongs/', { params: search ? { search } : undefined })
  return data
}

export async function getOng(id: string): Promise<Ong> {
  const { data } = await api.get<Ong>(`/ongs/${id}/`)
  return data
}

export async function getOngOfResponsible(userId: string): Promise<Ong | null> {
  const { data } = await api.get<Ong[]>('/ongs/', { params: { responsible: userId } })
  return data[0] ?? null
}

export async function createOng(ong: OngPayload): Promise<Ong> {
  const { data } = await api.post<Ong>('/ongs/', ong)
  return data
}

export async function updateOng(id: string, ong: OngPayload): Promise<Ong> {
  const { data } = await api.patch<Ong>(`/ongs/${id}/`, ong)
  return data
}
