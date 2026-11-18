import { useQuery } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { getOng } from '../api/ongs'
import { listPets } from '../api/pets'
import { PetCard } from '../components/PetCard'
import { Spinner } from '../components/Spinner'
import { apiErrorMessage } from '../shared/apiError'
import { PET_TYPES } from '../shared/types'

export default function PetListPage() {
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const type = params.get('type') ?? ''
  const ong = params.get('ong') ?? ''

  const pets = useQuery({
    queryKey: ['pets', { search, type, ong }],
    queryFn: () => listPets({ search, type, ong }),
  })
  const ongFilter = useQuery({
    queryKey: ['ong', ong],
    queryFn: () => getOng(ong),
    enabled: !!ong,
  })

  function applyFilters(form: HTMLFormElement): void {
    const data = new FormData(form)
    const next = { search: String(data.get('search') ?? ''), type: String(data.get('type') ?? ''), ong }
    setParams(Object.fromEntries(Object.entries(next).filter(([, value]) => value)))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    applyFilters(event.currentTarget)
  }

  function clearOng(): void {
    setParams(previous => {
      previous.delete('ong')
      return previous
    })
  }

  return (
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Pets para adoção</h1>
          <p className="text-body-secondary mb-0">Encontre um novo melhor amigo cadastrado por ONGs parceiras.</p>
        </div>
        <Link to="/pets/novo" className="btn btn-primary">
          Cadastrar pet
        </Link>
      </div>

      <form key={`${search}|${type}`} onSubmit={handleSubmit} className="row g-2 mb-3" role="search">
        <div className="col-md-6">
          <label htmlFor="search" className="visually-hidden">
            Buscar
          </label>
          <input
            id="search"
            name="search"
            type="search"
            className="form-control"
            defaultValue={search}
            placeholder="Buscar por nome, raça ou cidade"
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="type" className="visually-hidden">
            Espécie
          </label>
          <select
            id="type"
            name="type"
            className="form-select"
            defaultValue={type}
            onChange={event => applyFilters(event.currentTarget.form!)}
          >
            <option value="">Todas as espécies</option>
            {PET_TYPES.map(petType => (
              <option key={petType} value={petType}>
                {petType}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-outline-primary">
            Buscar
          </button>
        </div>
      </form>

      {ong && (
        <p>
          <span className="badge text-bg-light border fs-6 fw-normal">
            ONG: {ongFilter.data?.name || '...'}
            <button
              type="button"
              className="btn-close btn-close-sm ms-1 align-middle"
              aria-label="Remover filtro de ONG"
              onClick={clearOng}
            ></button>
          </span>
        </p>
      )}

      {pets.isPending ? (
        <Spinner />
      ) : pets.isError ? (
        <div className="alert alert-danger" role="alert">
          {apiErrorMessage(pets.error, 'Não foi possível carregar os pets.')}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {pets.data.map((pet, index) => (
            <div className="col" key={pet.id_animal}>
              <PetCard pet={pet} eager={index < 4} />
            </div>
          ))}
          {pets.data.length === 0 && (
            <div className="col-12">
              <div className="alert alert-light border text-center">Nenhum pet encontrado com esses filtros.</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
