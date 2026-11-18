import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { apiErrorMessage } from './apiError'

function httpError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() }
  const response = { status, data, statusText: '', headers: {}, config } as AxiosResponse
  return new AxiosError('erro', 'ERR_BAD_REQUEST', config, {}, response)
}

describe('apiErrorMessage', () => {
  it('formats field errors with friendly labels', () => {
    const error = httpError(400, { email: ['Já existe um usuário com este e-mail.'], detail: 'Erro geral.' })

    expect(apiErrorMessage(error)).toBe('E-mail: Já existe um usuário com este e-mail. Erro geral.')
  })

  it('explains when the API is unreachable', () => {
    expect(apiErrorMessage(new AxiosError('Network Error', 'ERR_NETWORK'))).toContain('Não foi possível conectar')
  })

  it('falls back to the default message', () => {
    expect(apiErrorMessage(new Error('boom'), 'Padrão')).toBe('Padrão')
  })
})
