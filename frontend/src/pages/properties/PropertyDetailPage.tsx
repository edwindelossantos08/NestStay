import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePropertyById, usePropertyReviews } from '../../hooks/useProperties'
import { useAuth } from '../../context/AuthContext'
import PropertyImage from '../../components/shared/PropertyImage'
import StarRating from '../../components/shared/StarRating'
import { formatPrice, calculateNights, timeAgo } from '../../utils/formatters'

// Card individual de reseña
const ReviewCard = ({
  review,
}: {
  review: { id: number; guestName: string; rating: number; comment: string; createdAt: string }
}) => (
  <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold uppercase">
          {review.guestName.charAt(0)}
        </div>
        <span className="font-medium text-gray-800 text-sm">{review.guestName}</span>
      </div>
      <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
    </div>
    <StarRating rating={review.rating} size="sm" />
    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
  </div>
)

// Skeleton para la página de detalle mientras carga
const DetailSkeleton = () => (
  <div className="animate-pulse max-w-6xl mx-auto px-4 py-8">
    <div className="h-72 md:h-96 bg-gray-200 rounded-2xl mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  </div>
)

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const propertyId = Number(id)
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const { data: property, isLoading, isError } = usePropertyById(propertyId)
  const { data: reviewsData } = usePropertyReviews(propertyId)

  // Estado del formulario de reserva
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  if (isLoading) return <DetailSkeleton />

  if (isError || !property) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-5xl mb-4">🏠</p>
        <h2 className="text-xl font-bold text-gray-700">Propiedad no encontrada</h2>
        <Link to="/" className="mt-4 text-[#1e3a5f] underline text-sm">
          Volver al inicio
        </Link>
      </div>
    )
  }

  // Verifica si el usuario autenticado es el host de esta propiedad
  const isHost = isAuthenticated && user?.id === property.hostId

  // Calcula el total según noches seleccionadas
  const nights =
    checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0
  const total = nights > 0 ? nights * property.pricePerNight : null

  const today = new Date().toISOString().split('T')[0]

  const reviews = reviewsData?.reviews ?? property.latestReviews ?? []

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Reserva en construcción — se implementará en tarea 8.4
    alert('Reserva en construcción')
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Imagen hero */}
        <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
          <PropertyImage
            imageUrl={property.imageUrl}
            title={property.title}
            id={property.id}
            variant="hero"
            className="w-full h-full object-cover"
          />
          {/* Gradiente inferior para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Título encima de la imagen */}
          <div className="absolute bottom-4 left-6 text-white">
            <h1 className="text-3xl font-bold drop-shadow">{property.title}</h1>
            <p className="text-white/80 mt-0.5">📍 {property.location}</p>
          </div>
        </div>

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda — info + reseñas */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Info general */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span>👤</span> Host: <strong className="text-gray-700 ml-1">{property.hostName}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span>👥</span> {property.capacity} {property.capacity === 1 ? 'persona' : 'personas'}
                </span>
                <span className="flex items-center gap-1">
                  <span>💰</span>
                  <strong className="text-[#1e3a5f]">{formatPrice(property.pricePerNight)}</strong>
                </span>
              </div>

              {/* Rating global */}
              {property.averageRating > 0 ? (
                <div className="flex items-center gap-2">
                  <StarRating rating={property.averageRating} size="md" />
                  <span className="text-gray-500 text-sm">
                    {property.averageRating.toFixed(1)} · {property.totalReviews}{' '}
                    {property.totalReviews === 1 ? 'reseña' : 'reseñas'}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Sin reseñas aún</span>
              )}

              {/* Descripción */}
              <div>
                <h2 className="font-semibold text-[#1e3a5f] mb-1">Descripción</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Sección de reseñas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-[#1e3a5f] text-lg mb-4">
                Reseñas {reviews.length > 0 && `(${reviews.length})`}
              </h2>

              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400">Esta propiedad aún no tiene reseñas.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha — card de reserva sticky */}
          <div className="lg:col-span-1">
            {isHost ? (
              // El host ve un badge en lugar del card de reserva
              <div className="bg-white rounded-xl shadow-sm p-6 text-center border-2 border-[#c9a84c]/40">
                <p className="text-2xl mb-2">🏠</p>
                <p className="font-semibold text-[#1e3a5f]">Esta es tu propiedad</p>
                <p className="text-sm text-gray-500 mt-1">
                  Gestiona disponibilidad y reservas desde tu panel.
                </p>
                <Link
                  to={`/host/properties/${property.id}/availability`}
                  className="mt-4 block text-center text-sm text-[#1e3a5f] underline"
                >
                  Ver disponibilidad
                </Link>
              </div>
            ) : (
              // Card de reserva para guests y usuarios no autenticados
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 flex flex-col gap-4">
                <p className="text-2xl font-bold text-[#1e3a5f]">
                  {formatPrice(property.pricePerNight)}
                </p>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value)
                        // Limpia check-out si queda antes del nuevo check-in
                        if (checkOut && e.target.value >= checkOut) setCheckOut('')
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                    />
                  </div>
                </div>

                {/* Resumen del total */}
                {total !== null && nights > 0 && (
                  <div className="bg-[#f9fafb] rounded-lg p-3 text-sm flex flex-col gap-1">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        ${property.pricePerNight} × {nights} {nights === 1 ? 'noche' : 'noches'}
                      </span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#1e3a5f] pt-1 border-t border-gray-200">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  className="w-full bg-[#c9a84c] hover:bg-[#b8963e] text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  {isAuthenticated ? 'Reservar' : 'Inicia sesión para reservar'}
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-gray-400">
                    <Link to="/login" className="text-[#1e3a5f] underline">
                      Inicia sesión
                    </Link>{' '}
                    o{' '}
                    <Link to="/register" className="text-[#1e3a5f] underline">
                      regístrate
                    </Link>{' '}
                    para hacer una reserva
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
