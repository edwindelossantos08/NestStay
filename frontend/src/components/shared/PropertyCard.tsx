import { Link } from 'react-router-dom'
import { MapPin, Users, Star } from 'lucide-react'
import type { PropertyResponse } from '../../types/property.types'
import { formatPrice } from '../../utils/formatters'
import ImageCarousel from './ImageCarousel'
import AmenityIcon from './AmenityIcon'

interface PropertyCardProps {
  property: PropertyResponse
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="block focus:outline-none"
    >
      {/* Carrusel de imágenes con navegación por flechas y dots */}
      <ImageCarousel
        images={property.images || []}
        imageUrl={property.imageUrl}
        title={property.title}
        propertyId={property.id}
      />

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

        {/* Mini chips de amenidades */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {property.amenities.slice(0, 3).map(amenity => (
              <span
                key={amenity.id}
                className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5"
              >
                <AmenityIcon iconName={amenity.icon} size={10} />
                {amenity.name}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-xs text-gray-400 px-1">
                +{property.amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default PropertyCard
