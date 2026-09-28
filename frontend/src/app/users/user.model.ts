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
