import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, User, Users, DollarSign, Home } from 'lucide-react'
import { usePropertyById, usePropertyReviews } from '../../hooks/useProperties'
import { useCreateBooking } from '../../hooks/useBookings'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { authApi } from '../../api/auth.api'
import PropertyImage from '../../components/shared/PropertyImage'
import StarRating from '../../components/shared/StarRating'
import Modal from '../../components/ui/Modal'
import DateRangePicker from '../../components/shared/DateRangePicker'
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
        <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center text-white text-xs font-bold uppercase">
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
  const { user, isAuthenticated, hasRole } = useAuth()
  const toast = useToast()

  const { data: property, isLoading, isError } = usePropertyById(propertyId)
  const { data: reviewsData } = usePropertyReviews(propertyId)
  const { mutate: createBooking, isPending: booking } = useCreateBooking()

  // Estado del formulario de reserva
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  // Modal para asignar rol Guest si el usuario no lo tiene
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [assigningRole, setAssigningRole] = useState(false)

  if (isLoading) return <DetailSkeleton />

  if (isError || !property) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Home className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Propiedad no encontrada</h2>
        <Link to="/" className="mt-4 text-coral underline text-sm">
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

  const handleAssignGuestRole = async () => {
    setAssigningRole(true)
    try {
      await authApi.assignRole({ role: 'Guest' })
      setShowRoleModal(false)
      toast.success('Rol activado', 'Ya puedes hacer reservas como huésped.')
    } catch {
      toast.error('Error', 'No se pudo asignar el rol. Intenta de nuevo.')
    } finally {
      setAssigningRole(false)
    }
  }

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!checkIn || !checkOut) {
      toast.info('Selecciona fechas', 'Elige las fechas de check-in y check-out.')
      return
    }

    // Verifica rol Guest — si no lo tiene, muestra modal para asignarse el rol
    if (!hasRole('Guest')) {
      setShowRoleModal(true)
      return
    }

    createBooking(
      { propertyId, checkIn, checkOut },
      {
        onSuccess: () => {
          toast.success('¡Reserva confirmada!', 'Tu reserva fue creada exitosamente.')
          navigate('/my-bookings')
        },
        onError: (err: unknown) => {
          // Error 409 indica fechas con conflicto de disponibilidad
          const status = (err as { response?: { status?: number } })?.response?.status
          if (status === 409) {
            toast.error('Fechas no disponibles', 'Esas fechas ya están reservadas. Elige otras.')
          } else {
            toast.error('Error al reservar', 'No se pudo crear la reserva. Intenta de nuevo.')
          }
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
            <p className="text-white/80 mt-0.5 flex items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0" />
              {property.location}
            </p>
          </div>
        </div>

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda — info + reseñas */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Info general */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 shrink-0" /> Host: <strong className="text-dark ml-1">{property.hostName}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 shrink-0" /> {property.capacity} {property.capacity === 1 ? 'persona' : 'personas'}
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 shrink-0" />
                  <strong className="text-coral">{formatPrice(property.pricePerNight)}</strong>
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
                <h2 className="font-semibold text-dark mb-1">Descripción</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Sección de reseñas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-dark text-lg mb-4">
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
              <div className="bg-white rounded-xl shadow-sm p-6 text-center border-2 border-coral/20">
                <Home className="h-10 w-10 text-coral mx-auto mb-2" />
                <p className="font-semibold text-dark">Esta es tu propiedad</p>
                <p className="text-sm text-gray-500 mt-1">
                  Gestiona disponibilidad y reservas desde tu panel.
                </p>
                <Link
                  to={`/host/properties/${property.id}/availability`}
                  className="mt-4 block text-center text-sm text-coral underline"
                >
                  Ver disponibilidad
                </Link>
              </div>
            ) : (
              // Card de reserva para guests y usuarios no autenticados
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 flex flex-col gap-4">
                <p className="text-2xl font-bold text-dark">
                  {formatPrice(property.pricePerNight)}
                  <span className="text-base font-normal text-gray-500"> / noche</span>
                </p>

                {/* Date Picker visual */}
                <DateRangePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  minDate={today}
                  onCheckInChange={(val) => {
                    setCheckIn(val)
                    if (checkOut && val >= checkOut) setCheckOut('')
                  }}
                  onCheckOutChange={setCheckOut}
                />

                {/* Resumen del total */}
                {total !== null && nights > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm flex flex-col gap-1">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        ${property.pricePerNight} × {nights} {nights === 1 ? 'noche' : 'noches'}
                      </span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-dark pt-1 border-t border-gray-200">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className="w-full bg-coral hover:bg-coral-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
                >
                  {booking
                    ? 'Reservando...'
                    : isAuthenticated
                    ? 'Reservar ahora'
                    : 'Inicia sesión para reservar'}
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-gray-400">
                    <Link to="/login" className="text-coral underline">
                      Inicia sesión
                    </Link>{' '}
                    o{' '}
                    <Link to="/register" className="text-coral underline">
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

      {/* Modal para asignar rol Guest si el usuario no lo tiene */}
      <Modal
        open={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Activa tu cuenta de huésped"
      >
        <p className="text-sm text-gray-600">
          Para hacer reservas necesitas activar el rol de huésped en tu cuenta.
          Es gratis e instantáneo.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowRoleModal(false)}
            className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssignGuestRole}
            disabled={assigningRole}
            className="flex-1 bg-coral text-white py-2 rounded-xl text-sm font-semibold hover:bg-coral-dark transition-colors disabled:opacity-60"
          >
            {assigningRole ? 'Activando...' : 'Activar rol huésped'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
