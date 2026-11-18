import { useQuery } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { listOngs } from '../api/ongs'
import { Spinner } from '../components/Spinner'
import { apiErrorMessage } from '../shared/apiError'

export default function OngListPage() {
  const [search, setSearch] = useState('')
  const ongs = useQuery({ queryKey: ['ongs', search], queryFn: () => listOngs(search) })

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const value = String(new FormData(event.currentTarget).get('search') ?? '')
    if (value === search) ongs.refetch()
    else setSearch(value)
  }

  return (
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">ONGs parceiras</h1>
          <p className="text-body-secondary mb-0">Organizações que cuidam dos animais até encontrarem um lar.</p>
        </div>
        <Link to="/ongs/nova" className="btn btn-primary">
          Cadastrar ONG
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="row g-2 mb-4" role="search">
        <div className="col-md-10">
          <label htmlFor="ong-search" className="visually-hidden">
            Buscar ONG
          </label>
          <input id="ong-search" name="search" type="search" className="form-control" placeholder="Buscar por nome ou cidade" />
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-outline-primary">
            Buscar
          </button>
        </div>
      </form>

      {ongs.isFetching && !ongs.isError ? (
        <Spinner />
      ) : ongs.isError ? (
        <div className="alert alert-danger" role="alert">
          {apiErrorMessage(ongs.error, 'Não foi possível carregar as ONGs.')}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {ongs.data?.map(ong => (
            <div className="col" key={ong.id_ong}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h2 className="h5 card-title">{ong.name}</h2>
                  <p className="card-text text-body-secondary small mb-1">
                    📍 {ong.city}/{ong.state}
                  </p>
                  <p className="card-text small mb-3">
                    <a href={`mailto:${ong.email}`}>{ong.email}</a>
                  </p>
                  <Link className="btn btn-outline-primary btn-sm mt-auto" to={`/pets?ong=${ong.id_ong}`}>
                    Ver pets da ONG
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {ongs.data?.length === 0 && (
            <div className="col-12">
              <div className="alert alert-light border text-center">Nenhuma ONG encontrada.</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
