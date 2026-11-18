import { screen } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { api } from '../api/client'
import type { Pet } from '../shared/types'
import { renderRoutes } from '../test/utils'
import PetListPage from './PetListPage'

const rex = {
  id_animal: '1',
  name_animal: 'Rex',
  type: 'Cachorro',
  breed: 'SRD',
  color: 'Caramelo',
  city: 'São Paulo',
  state: 'SP',
  ong_name: 'ONG Patinhas',
  image: null,
} as Pet

describe('PetListPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  afterEach(() => mock.restore())

  it('lists pets returned by the API using the url filters', async () => {
    mock.onGet('/pets/').reply(200, [rex])

    renderRoutes([{ path: '/pets', element: <PetListPage /> }], '/pets?search=rex&type=Cachorro')

    expect(await screen.findByText('Rex')).toBeInTheDocument()
    expect(mock.history.get[0].params).toEqual({ search: 'rex', type: 'Cachorro' })
    expect(screen.getAllByRole('link', { name: 'Quero conhecer' })).toHaveLength(1)
  })

  it('shows an empty state when no pet matches', async () => {
    mock.onGet('/pets/').reply(200, [])

    renderRoutes([{ path: '/pets', element: <PetListPage /> }], '/pets')

    expect(await screen.findByText(/Nenhum pet encontrado/)).toBeInTheDocument()
  })
})
