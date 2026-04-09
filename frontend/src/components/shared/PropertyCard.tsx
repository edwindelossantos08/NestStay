import { Link } from 'react-router-dom'
import type { PropertyResponse } from '../../types/property.types'
import { formatPrice } from '../../utils/formatters'
import PropertyImage from './PropertyImage'
import StarRating from './StarRating'

interface PropertyCardProps {
  property: PropertyResponse
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Imagen con efecto zoom en hover */}
      <div className="relative h-48 overflow-hidden rounded-t-xl group">
        <PropertyImage
          imageUrl={property.imageUrl}
          title={property.title}
          id={property.id}
          variant="card"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay sutil en hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          {property.averageRating > 0 ? (
            <>
              <StarRating rating={property.averageRating} size="sm" />
              <span className="text-sm text-gray-500">
                ({property.totalReviews} {property.totalReviews === 1 ? 'reseña' : 'reseñas'})
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">Sin reseñas</span>
          )}
        </div>

        {/* Título */}
        <h3 className="font-semibold text-[#1e3a5f] line-clamp-2 leading-tight">
          {property.title}
        </h3>

        {/* Ubicación */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>📍</span>
          {property.location}
        </p>

        {/* Capacidad */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>👥</span>
          Capacidad: {property.capacity} {property.capacity === 1 ? 'persona' : 'personas'}
        </p>

        {/* Espaciador */}
        <div className="flex-1" />

        {/* Precio */}
        <p className="text-[#1e3a5f] font-bold text-base">
          {formatPrice(property.pricePerNight)}
        </p>

        {/* CTA */}
        <Link
          to={`/properties/${property.id}`}
          className="block text-center bg-[#1e3a5f] hover:bg-[#16304f] text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200"
        >
          Ver propiedad
        </Link>
      </div>
    </div>
  )
}

export default PropertyCard
