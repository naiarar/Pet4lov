import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import { createOng, getOng, updateOng } from '../api/ongs'
import { queryClient } from '../api/queryClient'
import { getMe } from '../api/users'
import { Spinner } from '../components/Spinner'
import { apiErrorMessage, errorStatus } from '../shared/apiError'
import { BR_STATES } from '../shared/brStates'
import { EMAIL_PATTERN, invalidClass } from '../shared/format'
import type { OngPayload } from '../shared/types'

const EMPTY_ONG: OngPayload = { name: '', document: '', email: '', address: '', city: '', state: '' }

export default function OngFormPage() {
  const { id } = useParams()
  const me = useQuery({ queryKey: ['me'], queryFn: getMe })
  const ong = useQuery({ queryKey: ['ong', id], queryFn: () => getOng(id!), enabled: !!id })

  const loadError = me.error ?? ong.error
  const loading = me.isPending || (!!id && ong.isPending)

  let content
  if (loadError) {
    const message =
      errorStatus(loadError) === 404 ? 'ONG não encontrada.' : apiErrorMessage(loadError, 'Não foi possível carregar o formulário.')
    content = (
      <div className="alert alert-danger" role="alert">
        {message}
      </div>
    )
  } else if (loading) {
    content = <Spinner />
  } else if (ong.data && ong.data.responsible !== me.data?.id_user) {
    content = (
      <div className="alert alert-danger" role="alert">
        Você só pode editar a sua própria ONG.
      </div>
    )
  } else {
    const { id_ong: _id, responsible: _responsible, ...initial } = ong.data ?? { id_ong: '', responsible: '', ...EMPTY_ONG }
    content = <OngForm id={id} initial={initial} />
  }

  return (
    <div className="container form-page">
      <h1 className="h3 mb-4">{id ? 'Editar ONG' : 'Cadastrar ONG'}</h1>
      {content}
    </div>
  )
}

function OngForm({ id, initial }: { id?: string; initial: OngPayload }) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OngPayload>({ mode: 'onTouched', defaultValues: initial })

  async function onSubmit(values: OngPayload): Promise<void> {
    setErrorMessage('')
    try {
      await (id ? updateOng(id, values) : createOng(values))
      await queryClient.invalidateQueries({ queryKey: ['ong'] })
      await queryClient.invalidateQueries({ queryKey: ['ong-of'] })
      await queryClient.invalidateQueries({ queryKey: ['ongs'] })
      navigate('/minha-conta')
    } catch (error) {
      setErrorMessage(apiErrorMessage(error, 'Não foi possível salvar a ONG.'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card card-body shadow-sm" noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">
            Nome da ONG
          </label>
          <input id="name" type="text" className={invalidClass('form-control', errors.name)} {...register('name', { required: true })} />
          <div className="invalid-feedback">Informe o nome da ONG.</div>
        </div>

        <div className="col-md-6">
          <label htmlFor="document" className="form-label">
            CNPJ
          </label>
          <input
            id="document"
            type="text"
            className={invalidClass('form-control', errors.document)}
            {...register('document', { required: true })}
          />
          <div className="invalid-feedback">Informe o CNPJ.</div>
        </div>

        <div className="col-12">
          <label htmlFor="email" className="form-label">
            E-mail de contato
          </label>
          <input
            id="email"
            type="email"
            className={invalidClass('form-control', errors.email)}
            {...register('email', { required: true, pattern: EMAIL_PATTERN })}
          />
          <div className="invalid-feedback">Informe um e-mail válido.</div>
        </div>

        <div className="col-12">
          <label htmlFor="address" className="form-label">
            Endereço
          </label>
          <input
            id="address"
            type="text"
            className={invalidClass('form-control', errors.address)}
            {...register('address', { required: true })}
          />
          <div className="invalid-feedback">Informe o endereço.</div>
        </div>

        <div className="col-md-8">
          <label htmlFor="city" className="form-label">
            Cidade
          </label>
          <input id="city" type="text" className={invalidClass('form-control', errors.city)} {...register('city', { required: true })} />
          <div className="invalid-feedback">Informe a cidade.</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="state" className="form-label">
            Estado
          </label>
          <select id="state" className={invalidClass('form-select', errors.state)} {...register('state', { required: true })}>
            <option value="" disabled>
              UF
            </option>
            {BR_STATES.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">Selecione o estado.</div>
        </div>

        {errorMessage && (
          <div className="col-12">
            <div className="alert alert-danger py-2 mb-0" role="alert">
              {errorMessage}
            </div>
          </div>
        )}

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
          <Link to="/minha-conta" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  )
}
