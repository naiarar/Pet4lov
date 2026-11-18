import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import { getOngOfResponsible } from '../api/ongs'
import { createPet, getPet, updatePet } from '../api/pets'
import { queryClient } from '../api/queryClient'
import { getMe } from '../api/users'
import { Spinner } from '../components/Spinner'
import { apiErrorMessage, errorStatus } from '../shared/apiError'
import { BR_STATES } from '../shared/brStates'
import { invalidClass } from '../shared/format'
import { PET_TYPES, type Ong, type Pet } from '../shared/types'

export interface PetFormValues {
  name_animal: string
  type: string
  breed: string
  color: string
  birth_date: string
  health_condition: string
  vaccination_status: string
  deworming_status: string
  observations: string
  city: string
  state: string
}

function initialValues(pet: Pet | undefined, ong: Ong): PetFormValues {
  return {
    name_animal: pet?.name_animal ?? '',
    type: pet?.type ?? '',
    breed: pet?.breed ?? '',
    color: pet?.color ?? '',
    birth_date: pet?.birth_date ?? '',
    health_condition: pet?.health_condition ?? '',
    vaccination_status: pet?.vaccination_status ?? '',
    deworming_status: pet?.deworming_status ?? '',
    observations: pet?.observations ?? '',
    city: pet?.city ?? ong.city,
    state: pet?.state ?? ong.state,
  }
}

export default function PetFormPage() {
  const { id } = useParams()
  const me = useQuery({ queryKey: ['me'], queryFn: getMe })
  const userId = me.data?.id_user ?? ''
  const ong = useQuery({ queryKey: ['ong-of', userId], queryFn: () => getOngOfResponsible(userId), enabled: !!userId })
  const pet = useQuery({ queryKey: ['pet', id], queryFn: () => getPet(id!), enabled: !!id })

  const loadError = me.error ?? ong.error ?? pet.error
  const loading = me.isPending || ong.isPending || (!!id && pet.isPending)

  let content
  if (loadError) {
    const message =
      errorStatus(loadError) === 404 ? 'Pet não encontrado.' : apiErrorMessage(loadError, 'Não foi possível carregar o formulário.')
    content = (
      <div className="alert alert-danger" role="alert">
        {message}
      </div>
    )
  } else if (loading) {
    content = <Spinner />
  } else if (pet.data && pet.data.responsible !== userId) {
    content = (
      <div className="alert alert-danger" role="alert">
        Você só pode editar pets cadastrados por você.
      </div>
    )
  } else if (!ong.data) {
    content = (
      <div className="alert alert-warning">
        Para cadastrar pets você precisa ter uma ONG.{' '}
        <Link to="/ongs/nova" className="alert-link">
          Cadastre sua ONG
        </Link>{' '}
        primeiro.
      </div>
    )
  } else {
    content = <PetForm id={id} ong={ong.data} pet={pet.data} />
  }

  return (
    <div className="container form-page">
      <h1 className="h3 mb-4">{id ? 'Editar pet' : 'Cadastrar pet'}</h1>
      {content}
    </div>
  )
}

interface PetFormProps {
  id?: string
  ong: Ong
  pet?: Pet
}

function PetForm({ id, ong, pet }: PetFormProps) {
  const navigate = useNavigate()
  const [image, setImage] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetFormValues>({ mode: 'onTouched', defaultValues: initialValues(pet, ong) })

  async function onSubmit(values: PetFormValues): Promise<void> {
    const data = new FormData()
    data.append('ong', ong.id_ong)
    for (const [key, value] of Object.entries(values)) data.append(key, value)
    if (image) data.append('image', image)

    setErrorMessage('')
    try {
      const saved = await (id ? updatePet(id, data) : createPet(data))
      queryClient.setQueryData(['pet', saved.id_animal], saved)
      await queryClient.invalidateQueries({ queryKey: ['pets'] })
      navigate(`/pets/${saved.id_animal}`)
    } catch (error) {
      setErrorMessage(apiErrorMessage(error, 'Não foi possível salvar o pet.'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card card-body shadow-sm" noValidate>
      <p className="text-body-secondary">
        ONG: <strong>{ong.name}</strong>
      </p>

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="name_animal" className="form-label">
            Nome
          </label>
          <input
            id="name_animal"
            type="text"
            className={invalidClass('form-control', errors.name_animal)}
            {...register('name_animal', { required: true })}
          />
          <div className="invalid-feedback">Informe o nome do pet.</div>
        </div>

        <div className="col-md-6">
          <label htmlFor="type" className="form-label">
            Espécie
          </label>
          <select id="type" className={invalidClass('form-select', errors.type)} {...register('type', { required: true })}>
            <option value="" disabled>
              Selecione
            </option>
            {PET_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">Selecione a espécie.</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="breed" className="form-label">
            Raça
          </label>
          <input
            id="breed"
            type="text"
            placeholder="Ex.: SRD"
            className={invalidClass('form-control', errors.breed)}
            {...register('breed', { required: true })}
          />
          <div className="invalid-feedback">Informe a raça.</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="color" className="form-label">
            Cor
          </label>
          <input
            id="color"
            type="text"
            maxLength={20}
            className={invalidClass('form-control', errors.color)}
            {...register('color', { required: true })}
          />
          <div className="invalid-feedback">Informe a cor.</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="birth_date" className="form-label">
            Nascimento (aprox.)
          </label>
          <input
            id="birth_date"
            type="date"
            className={invalidClass('form-control', errors.birth_date)}
            {...register('birth_date', { required: true })}
          />
          <div className="invalid-feedback">Informe a data.</div>
        </div>

        <div className="col-12">
          <label htmlFor="health_condition" className="form-label">
            Condição de saúde
          </label>
          <input
            id="health_condition"
            type="text"
            className={invalidClass('form-control', errors.health_condition)}
            {...register('health_condition', { required: true })}
          />
          <div className="invalid-feedback">Descreva a condição de saúde.</div>
        </div>

        <div className="col-md-6">
          <label htmlFor="vaccination_status" className="form-label">
            Vacinação
          </label>
          <input id="vaccination_status" type="text" className="form-control" placeholder="Ex.: V10 em dia" {...register('vaccination_status')} />
        </div>

        <div className="col-md-6">
          <label htmlFor="deworming_status" className="form-label">
            Vermifugação
          </label>
          <input
            id="deworming_status"
            type="text"
            className="form-control"
            placeholder="Ex.: Feita em 03/2024"
            {...register('deworming_status')}
          />
        </div>

        <div className="col-md-8">
          <label htmlFor="city" className="form-label">
            Cidade
          </label>
          <input
            id="city"
            type="text"
            maxLength={30}
            className={invalidClass('form-control', errors.city)}
            {...register('city', { required: true })}
          />
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

        <div className="col-12">
          <label htmlFor="observations" className="form-label">
            Observações
          </label>
          <textarea id="observations" className="form-control" rows={3} maxLength={250} {...register('observations', { maxLength: 250 })} />
        </div>

        <div className="col-12">
          <label htmlFor="image" className="form-label">
            Foto
          </label>
          {pet?.image && !image && <img src={pet.image} alt="Foto atual" className="d-block rounded mb-2" width={120} />}
          <input
            id="image"
            type="file"
            className="form-control"
            accept="image/*"
            onChange={event => setImage(event.currentTarget.files?.[0] ?? null)}
          />
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
