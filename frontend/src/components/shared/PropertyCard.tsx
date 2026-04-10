import { Link } from 'react-router-dom'
import { MapPin, Users } from 'lucide-react'
import type { PropertyResponse } from '../../types/property.types'
import { formatPrice } from '../../utils/formatters'
import PropertyImage from './PropertyImage'
import StarRating from './StarRating'

interface PropertyCardProps {
  property: PropertyResponse
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
    >
      {/* Imagen con aspect-ratio cuadrado */}
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <PropertyImage
          imageUrl={property.imageUrl}
          title={property.title}
          id={property.id}
          variant="card"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-1 pt-3">
        {/* Título + Rating en la misma fila */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-dark line-clamp-1 text-sm leading-tight flex-1">
            {property.title}
          </h3>
          {property.averageRating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              <StarRating rating={property.averageRating} size="sm" maxStars={1} />
              <span className="text-xs font-medium text-dark">
                {property.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Ubicación */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {property.location}
        </p>

        {/* Capacidad */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Users className="h-3.5 w-3.5 shrink-0" />
          {property.capacity} {property.capacity === 1 ? 'persona' : 'personas'}
        </p>

        {/* Precio */}
        <p className="text-sm text-dark font-semibold mt-0.5">
          <span className="font-bold">{formatPrice(property.pricePerNight)}</span>
          <span className="font-normal text-gray-500"> noche</span>
        </p>
      </div>
    </Link>
  )
}

export default PropertyCard
