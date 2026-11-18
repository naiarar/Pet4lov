import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router'
import { getOngOfResponsible } from '../api/ongs'
import { deletePet, listPets } from '../api/pets'
import { queryClient } from '../api/queryClient'
import { getMe } from '../api/users'
import { Spinner } from '../components/Spinner'
import { apiErrorMessage } from '../shared/apiError'
import { formatDate } from '../shared/format'
import type { Pet } from '../shared/types'

export default function AccountPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const me = useQuery({ queryKey: ['me'], queryFn: getMe })
  const userId = me.data?.id_user ?? ''
  const ong = useQuery({ queryKey: ['ong-of', userId], queryFn: () => getOngOfResponsible(userId), enabled: !!userId })
  const petsKey = ['pets', { responsible: userId }]
  const pets = useQuery({ queryKey: petsKey, queryFn: () => listPets({ responsible: userId }), enabled: !!userId })

  const removal = useMutation({
    mutationFn: (pet: Pet) => deletePet(pet.id_animal),
    onSuccess: (_result, pet) => {
      queryClient.setQueryData<Pet[]>(petsKey, current => current?.filter(item => item.id_animal !== pet.id_animal))
      queryClient.invalidateQueries({ queryKey: ['pets'], refetchType: 'none' })
      queryClient.removeQueries({ queryKey: ['pet', pet.id_animal] })
    },
    onError: error => setErrorMessage(apiErrorMessage(error, 'Não foi possível remover o pet.')),
  })

  function handleDelete(pet: Pet): void {
    if (!window.confirm(`Remover ${pet.name_animal || 'este pet'} da lista de adoção?`)) return
    removal.mutate(pet)
  }

  const loadError = me.error ?? ong.error ?? pets.error
  if (loadError) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {apiErrorMessage(loadError, 'Não foi possível carregar sua conta.')}
        </div>
      </div>
    )
  }

  if (!me.data || ong.isPending || !pets.data) {
    return (
      <div className="container">
        <Spinner />
      </div>
    )
  }

  const user = me.data
  const myOng = ong.data

  return (
    <div className="container">
      <h1 className="h3 mb-4">Olá, {user.name}!</h1>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h5">Meus dados</h2>
              <dl className="mb-0 small">
                <dt>E-mail</dt>
                <dd>{user.email}</dd>
                <dt>Telefone</dt>
                <dd>{user.contact || '—'}</dd>
                <dt>Nascimento</dt>
                <dd>{user.birth_date ? formatDate(user.birth_date) : '—'}</dd>
                <dt>Endereço</dt>
                <dd className="mb-0">{user.address || '—'}</dd>
              </dl>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5">Minha ONG</h2>
              {myOng ? (
                <>
                  <p className="mb-1 fw-semibold">{myOng.name}</p>
                  <p className="small text-body-secondary">
                    {myOng.city}/{myOng.state} · {myOng.email}
                  </p>
                  <Link to={`/ongs/${myOng.id_ong}/editar`} className="btn btn-outline-primary btn-sm">
                    Editar ONG
                  </Link>
                </>
              ) : (
                <>
                  <p className="small text-body-secondary">
                    Você ainda não cadastrou uma ONG. Com ela você pode divulgar pets para adoção.
                  </p>
                  <Link to="/ongs/nova" className="btn btn-primary btn-sm">
                    Cadastrar ONG
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 mb-0">Meus pets</h2>
                {myOng && (
                  <Link to="/pets/novo" className="btn btn-primary btn-sm">
                    Cadastrar pet
                  </Link>
                )}
              </div>

              {pets.data.length ? (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Espécie</th>
                        <th scope="col">Cidade</th>
                        <th scope="col" className="text-end">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pets.data.map(pet => (
                        <tr key={pet.id_animal}>
                          <td>
                            <Link to={`/pets/${pet.id_animal}`}>{pet.name_animal || 'Sem nome'}</Link>
                          </td>
                          <td>{pet.type}</td>
                          <td>
                            {pet.city}/{pet.state}
                          </td>
                          <td className="text-end text-nowrap">
                            <Link to={`/pets/${pet.id_animal}/editar`} className="btn btn-outline-secondary btn-sm">
                              Editar
                            </Link>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm ms-1"
                              onClick={() => handleDelete(pet)}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-body-secondary mb-0">Nenhum pet cadastrado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
