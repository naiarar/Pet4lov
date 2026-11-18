import { describe, expect, it } from 'vitest'
import type { Pet } from './types'
import { contactHref } from './contact'

describe('contactHref', () => {
  it('encodes the pet name in the e-mail subject', () => {
    const pet = { ong_email: 'contato@ong.org', name_animal: 'Mel & Café?' } as Pet

    expect(contactHref(pet)).toBe('mailto:contato@ong.org?subject=Quero%20adotar%20Mel%20%26%20Caf%C3%A9%3F')
  })

  it('uses a generic subject when the pet has no name', () => {
    const pet = { ong_email: 'contato@ong.org', name_animal: null } as Pet

    expect(contactHref(pet)).toBe('mailto:contato@ong.org?subject=Quero%20adotar%20um%20pet')
  })
})
