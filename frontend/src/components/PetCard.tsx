import { Link } from 'react-router'
import type { Pet } from '../shared/types'

export const PET_PLACEHOLDER = '/assets/pet-placeholder.png'

interface PetCardProps {
  pet: Pet
  eager?: boolean
}

export function PetCard({ pet, eager = false }: PetCardProps) {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={pet.image || PET_PLACEHOLDER}
        className={`card-img-top card-img-pet${pet.image ? '' : ' is-placeholder'}`}
        alt={`Foto de ${pet.name_animal || pet.type}`}
        loading={eager ? 'eager' : 'lazy'}
      />
      <div className="card-body d-flex flex-column">
        <h2 className="h5 card-title mb-1">{pet.name_animal || 'Sem nome'}</h2>
        <p className="card-text text-body-secondary small mb-2">
          {pet.type} · {pet.breed} · {pet.color}
        </p>
        <p className="card-text small mb-3">
          📍 {pet.city}/{pet.state} · {pet.ong_name}
        </p>
        <Link to={`/pets/${pet.id_animal}`} className="btn btn-outline-primary btn-sm mt-auto stretched-link">
          Quero conhecer
        </Link>
      </div>
    </div>
  )
}
