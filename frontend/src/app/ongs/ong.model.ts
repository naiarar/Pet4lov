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
