import { HttpErrorResponse } from '@angular/common/http';

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
};

export function apiErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;
  if (error.status === 0) return 'Não foi possível conectar à API. Verifique se o backend está rodando.';

  const body = error.error;
  if (!body || typeof body !== 'object') return fallback;

  const messages = Object.entries(body).map(([field, value]) => {
    const text = ([] as unknown[]).concat(value).join(' ');
    return field in FIELD_LABELS ? `${FIELD_LABELS[field]}: ${text}` : text;
  });
  return messages.length ? messages.join(' ') : fallback;
}
