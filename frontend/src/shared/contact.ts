import type { Pet } from './types'

export function contactHref(pet: Pick<Pet, 'ong_email' | 'name_animal'>): string {
  const subject = encodeURIComponent(`Quero adotar ${pet.name_animal || 'um pet'}`)
  return `mailto:${pet.ong_email}?subject=${subject}`
}
