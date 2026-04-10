import { Link } from 'react-router-dom'
import { MapPin, Users, Star } from 'lucide-react'
import type { PropertyResponse } from '../../types/property.types'
import { formatPrice } from '../../utils/formatters'
import PropertyImage from './PropertyImage'

interface PropertyCardProps {
  property: PropertyResponse
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block focus:outline-none"
    >
      {/* Imagen – aspect-ratio 4/3 */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
        <PropertyImage
          imageUrl={property.imageUrl}
          title={property.title}
          id={property.id}
          variant="card"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay sutil en hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.06]" />
      </div>

      {/* Info */}
      <div className="pt-3 flex flex-col gap-1">
        {/* Fila: título + rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1 font-semibold text-gray-900 leading-snug line-clamp-2 text-[15px]">
            {property.title}
          </h3>
          {property.averageRating > 0 && (
            <span className="flex items-center gap-0.5 text-sm font-medium text-gray-700 shrink-0">
              <Star className="h-3.5 w-3.5 fill-current text-[#c9a84c]" />
              {property.averageRating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Ubicación */}
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {property.location}
        </p>

        {/* Capacidad */}
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <Users className="h-3.5 w-3.5 shrink-0" />
          {property.capacity} {property.capacity === 1 ? 'persona' : 'personas'}
        </p>

        {/* Precio */}
        <p className="mt-1 text-[15px] text-gray-900">
          <span className="font-bold">{formatPrice(property.pricePerNight)}</span>
          <span className="font-normal text-gray-500 text-sm"> / noche</span>
        </p>
      </div>
    </Link>
  )
}

export default PropertyCard
