import { createSearchParams } from 'react-router'

export function loginPath(returnUrl: string): string {
  return `/login?${createSearchParams({ returnUrl })}`
}

export function safeReturnUrl(value: string | null): string {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/minha-conta'
}
