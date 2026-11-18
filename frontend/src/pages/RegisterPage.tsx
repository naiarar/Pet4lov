import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { registerUser } from '../api/users'
import { loginPath } from '../auth/paths'
import { apiErrorMessage } from '../shared/apiError'
import { EMAIL_PATTERN, invalidClass } from '../shared/format'

interface RegisterForm {
  name: string
  username: string
  email: string
  document_cpf: string
  birth_date: string
  address: string
  contact: string
  password: string
  terms: boolean
}

const EMPTY_FORM: RegisterForm = {
  name: '',
  username: '',
  email: '',
  document_cpf: '',
  birth_date: '',
  address: '',
  contact: '',
  password: '',
  terms: false,
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ mode: 'onTouched', defaultValues: EMPTY_FORM })

  async function onSubmit({ terms: _terms, ...user }: RegisterForm): Promise<void> {
    setErrorMessage('')
    try {
      await registerUser(user)
      navigate(loginPath('/minha-conta'))
    } catch (error) {
      setErrorMessage(apiErrorMessage(error, 'Não foi possível criar a conta.'))
    }
  }

  return (
    <div className="container form-page">
      <h1 className="h3 mb-4">Criar conta</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card card-body shadow-sm" noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              className={invalidClass('form-control', errors.name)}
              autoComplete="name"
              {...register('name', { required: true })}
            />
            <div className="invalid-feedback">Informe seu nome.</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="username" className="form-label">
              Nome de usuário
            </label>
            <input
              id="username"
              type="text"
              className={invalidClass('form-control', errors.username)}
              autoComplete="username"
              {...register('username', { required: true })}
            />
            <div className="invalid-feedback">Informe um nome de usuário.</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className={invalidClass('form-control', errors.email)}
              autoComplete="email"
              {...register('email', { required: true, pattern: EMAIL_PATTERN })}
            />
            <div className="invalid-feedback">Informe um e-mail válido.</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="document_cpf" className="form-label">
              CPF
            </label>
            <input
              id="document_cpf"
              type="text"
              inputMode="numeric"
              maxLength={11}
              placeholder="Somente números"
              className={invalidClass('form-control', errors.document_cpf)}
              {...register('document_cpf', { required: true, pattern: /^\d{11}$/ })}
            />
            <div className="invalid-feedback">O CPF deve ter 11 dígitos.</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="birth_date" className="form-label">
              Data de nascimento
            </label>
            <input
              id="birth_date"
              type="date"
              className={invalidClass('form-control', errors.birth_date)}
              {...register('birth_date', { required: true })}
            />
            <div className="invalid-feedback">Informe sua data de nascimento.</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="contact" className="form-label">
              Telefone
            </label>
            <input
              id="contact"
              type="tel"
              className={invalidClass('form-control', errors.contact)}
              autoComplete="tel"
              {...register('contact', { required: true })}
            />
            <div className="invalid-feedback">Informe um telefone para contato.</div>
          </div>

          <div className="col-12">
            <label htmlFor="address" className="form-label">
              Endereço
            </label>
            <input
              id="address"
              type="text"
              className={invalidClass('form-control', errors.address)}
              autoComplete="street-address"
              {...register('address', { required: true })}
            />
            <div className="invalid-feedback">Informe seu endereço.</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className={invalidClass('form-control', errors.password)}
              autoComplete="new-password"
              {...register('password', { required: true, minLength: 8 })}
            />
            <div className="invalid-feedback">A senha deve ter pelo menos 8 caracteres.</div>
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                id="terms"
                type="checkbox"
                className={invalidClass('form-check-input', errors.terms)}
                {...register('terms', { validate: value => value })}
              />
              <label htmlFor="terms" className="form-check-label">
                Aceito os termos de uso
              </label>
              <div className="invalid-feedback">É preciso aceitar os termos.</div>
            </div>
          </div>

          {errorMessage && (
            <div className="col-12">
              <div className="alert alert-danger py-2 mb-0" role="alert">
                {errorMessage}
              </div>
            </div>
          )}

          <div className="col-12 d-flex gap-2 align-items-center">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar conta'}
            </button>
            <span className="text-body-secondary">
              Já tem conta? <Link to="/login">Entrar</Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}
