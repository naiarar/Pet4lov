import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorMessage } from './api-error';

describe('apiErrorMessage', () => {
  it('formats field errors with friendly labels', () => {
    const error = new HttpErrorResponse({ status: 400, error: { email: ['Já existe um usuário com este e-mail.'], detail: 'Erro geral.' } });

    expect(apiErrorMessage(error)).toBe('E-mail: Já existe um usuário com este e-mail. Erro geral.');
  });

  it('explains when the API is unreachable', () => {
    expect(apiErrorMessage(new HttpErrorResponse({ status: 0 }))).toContain('Não foi possível conectar');
  });

  it('falls back to the default message', () => {
    expect(apiErrorMessage(new Error('boom'), 'Padrão')).toBe('Padrão');
  });
});
