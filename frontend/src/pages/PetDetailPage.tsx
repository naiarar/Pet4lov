import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { getPet } from '../api/pets'
import { PET_PLACEHOLDER } from '../components/PetCard'
import { Spinner } from '../components/Spinner'
import { apiErrorMessage, errorStatus } from '../shared/apiError'
import { contactHref } from '../shared/contact'
import { formatDate } from '../shared/format'
import type { Pet } from '../shared/types'

export default function PetDetailPage() {
  const { id = '' } = useParams()
  const query = useQuery({ queryKey: ['pet', id], queryFn: () => getPet(id) })

  return (
    <div className="container">
      <Link to="/pets" className="d-inline-block mb-3">
        ← Voltar para a lista
      </Link>

      {query.isError ? (
        <div className="alert alert-danger" role="alert">
          {errorStatus(query.error) === 404 ? 'Pet não encontrado.' : apiErrorMessage(query.error)}
        </div>
      ) : query.isPending ? (
        <Spinner />
      ) : (
        <PetDetail pet={query.data} />
      )}
    </div>
  )
}

function PetDetail({ pet }: { pet: Pet }) {
  return (
    <div className="row g-4">
      <div className="col-md-6">
        <img
          src={pet.image || PET_PLACEHOLDER}
          className={`img-fluid rounded shadow-sm w-100 card-img-pet${pet.image ? '' : ' is-placeholder'}`}
          alt={`Foto de ${pet.name_animal || pet.type}`}
        />
      </div>
      <div className="col-md-6">
        <h1 className="h2">{pet.name_animal || 'Sem nome'}</h1>
        <p className="text-body-secondary">
          {pet.type} · {pet.breed} · {pet.color}
        </p>

        <dl className="row">
          <dt className="col-sm-5">Nascimento</dt>
          <dd className="col-sm-7">{formatDate(pet.birth_date)}</dd>
          <dt className="col-sm-5">Localização</dt>
          <dd className="col-sm-7">
            {pet.city}/{pet.state}
          </dd>
          <dt className="col-sm-5">Saúde</dt>
          <dd className="col-sm-7">{pet.health_condition}</dd>
          <dt className="col-sm-5">Vacinação</dt>
          <dd className="col-sm-7">{pet.vaccination_status || 'Não informado'}</dd>
          <dt className="col-sm-5">Vermifugação</dt>
          <dd className="col-sm-7">{pet.deworming_status || 'Não informado'}</dd>
          {pet.observations && (
            <>
              <dt className="col-sm-5">Observações</dt>
              <dd className="col-sm-7">{pet.observations}</dd>
            </>
          )}
        </dl>

        <div className="card card-body bg-light border-0">
          <p className="mb-2">
            Quer adotar? Fale com a <strong>{pet.ong_name}</strong>.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <a className="btn btn-primary" href={contactHref(pet)}>
              Entrar em contato
            </a>
            <Link className="btn btn-outline-primary" to={`/pets?ong=${pet.ong}`}>
              Outros pets da ONG
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
