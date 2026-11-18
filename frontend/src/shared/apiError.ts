import { isAxiosError } from 'axios'

const FIELD_LABELS: Record<string, string> = {
  name: 'Nome',
  username: 'Usuário',
  email: 'E-mail',
  password: 'Senha',
  document_cpf: 'CPF',
  document: 'Documento',
  birth_date: 'Data de nascimento',
  address: 'Endereço',
  contact: 'Contato',
  city: 'Cidade',
  state: 'Estado',
  ong: 'ONG',
  image: 'Foto',
}

export function errorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined
}

export function apiErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (!isAxiosError(error)) return fallback
  if (!error.response) return 'Não foi possível conectar à API. Verifique se o backend está rodando.'

  const body: unknown = error.response.data
  if (!body || typeof body !== 'object') return fallback

  const messages = Object.entries(body).map(([field, value]) => {
    const text = ([] as unknown[]).concat(value).join(' ')
    return field in FIELD_LABELS ? `${FIELD_LABELS[field]}: ${text}` : text
  })
  return messages.length ? messages.join(' ') : fallback
}
