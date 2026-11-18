import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { api } from './client'
import { createPet, listPets } from './pets'

describe('pets api', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  afterEach(() => mock.restore())

  it('sends only the filters that have a value', async () => {
    mock.onGet('/pets/').reply(200, [])

    await listPets({ search: 'rex', type: '', ong: undefined })

    expect(mock.history.get[0].params).toEqual({ search: 'rex' })
  })

  it('uploads pets as multipart form data', async () => {
    const data = new FormData()
    data.append('name_animal', 'Rex')
    mock.onPost('/pets/').reply(201, { id_animal: '1' })

    await createPet(data)

    expect(mock.history.post[0].data).toBe(data)
  })
})
