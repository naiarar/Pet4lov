export interface Pet {
  id_animal: string
  responsible: string
  ong: string
  ong_name: string
  ong_email: string
  name_animal: string | null
  type: string
  breed: string
  color: string
  birth_date: string
  adoption_date: string | null
  health_condition: string
  vaccination_status: string | null
  deworming_status: string | null
  observations: string | null
  city: string
  state: string
  image: string | null
}

export interface PetFilters {
  search?: string
  type?: string
  ong?: string
  responsible?: string
}

export const PET_TYPES = ['Cachorro', 'Gato', 'Coelho', 'Pássaro', 'Outro']

export interface Ong {
  id_ong: string
  name: string
  responsible: string
  document: string
  address: string
  city: string
  state: string
  email: string
}

export type OngPayload = Omit<Ong, 'id_ong' | 'responsible'>

export interface User {
  id_user: string
  name: string
  username: string
  email: string
  document_cpf: string | null
  birth_date: string | null
  address: string | null
  contact: string | null
}

export interface NewUser extends Omit<User, 'id_user'> {
  password: string
}
