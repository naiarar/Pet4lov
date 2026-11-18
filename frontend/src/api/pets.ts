import type { Pet, PetFilters } from '../shared/types'
import { api } from './client'

export async function listPets(filters: PetFilters = {}): Promise<Pet[]> {
  const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
  const { data } = await api.get<Pet[]>('/pets/', { params })
  return data
}

export async function getPet(id: string): Promise<Pet> {
  const { data } = await api.get<Pet>(`/pets/${id}/`)
  return data
}

export async function createPet(pet: FormData): Promise<Pet> {
  const { data } = await api.post<Pet>('/pets/', pet)
  return data
}

export async function updatePet(id: string, pet: FormData): Promise<Pet> {
  const { data } = await api.patch<Pet>(`/pets/${id}/`, pet)
  return data
}

export async function deletePet(id: string): Promise<void> {
  await api.delete(`/pets/${id}/`)
}
