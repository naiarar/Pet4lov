import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { login } from '../api/auth'
import { safeReturnUrl } from '../auth/paths'
import { apiErrorMessage, errorStatus } from '../shared/apiError'
import { EMAIL_PATTERN, invalidClass } from '../shared/format'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: 'onTouched', defaultValues: { email: '', password: '' } })

  async function onSubmit({ email, password }: LoginForm): Promise<void> {
    setErrorMessage('')
    try {
      await login(email, password)
      navigate(safeReturnUrl(params.get('returnUrl')))
    } catch (error) {
      setErrorMessage(errorStatus(error) === 401 ? 'E-mail ou senha inválidos.' : apiErrorMessage(error))
    }
  }

  return (
    <div className="container auth-page">
      <h1 className="h3 mb-4 text-center">Entrar</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card card-body shadow-sm" noValidate>
        <div className="mb-3">
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

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Senha
          </label>
          <input
            id="password"
            type="password"
            className={invalidClass('form-control', errors.password)}
            autoComplete="current-password"
            {...register('password', { required: true })}
          />
          <div className="invalid-feedback">Informe sua senha.</div>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2" role="alert">
            {errorMessage}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-center mt-3">
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  )
}
