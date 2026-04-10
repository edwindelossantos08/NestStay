import { Link } from 'react-router-dom'
import { Home, Calendar, CheckCircle, Star, MapPin } from 'lucide-react'
import { useMyProperties } from '../../hooks/useProperties'
import { useReceivedBookings } from '../../hooks/useBookings'
import PropertyImage from '../../components/shared/PropertyImage'
import Badge from '../../components/ui/Badge'
import { formatDate, formatPrice } from '../../utils/formatters'
import type { BookingStatus } from '../../types/booking.types'

// Mapea el estado de reserva al variant del Badge
const statusVariant: Record<BookingStatus, 'confirmed' | 'cancelled' | 'completed'> = {
  Confirmed: 'confirmed',
  Cancelled: 'cancelled',
  Completed: 'completed',
}

const statusLabel: Record<BookingStatus, string> = {
  Confirmed: 'Confirmada',
  Cancelled: 'Cancelada',
  Completed: 'Completada',
}

// Card de estadística reutilizable
const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) => (
  <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-coral/10 text-coral">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-dark">{value}</p>
    </div>
  </div>
)

export default function DashboardPage() {
  const { data: properties = [], isLoading: loadingProps } = useMyProperties()
  const { data: bookings = [], isLoading: loadingBookings } = useReceivedBookings()

  // Calcula stats a partir de los datos
  const activeBookings = bookings.filter((b) => b.status === 'Confirmed').length
  const completedBookings = bookings.filter((b) => b.status === 'Completed').length

  const avgRating =
    properties.length > 0
      ? properties.reduce((sum, p) => sum + p.averageRating, 0) / properties.length
      : 0

  // Últimas 5 reservas recibidas
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Primeras 3 propiedades para acceso rápido
  const quickProperties = properties.slice(0, 3)

  const isLoading = loadingProps || loadingBookings

  return (
    <div className="flex flex-col gap-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Resumen de tus propiedades y reservas
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Propiedades" value={properties.length} icon={<Home className="h-6 w-6" />} />
          <StatCard label="Reservas activas" value={activeBookings} icon={<Calendar className="h-6 w-6" />} />
          <StatCard label="Completadas" value={completedBookings} icon={<CheckCircle className="h-6 w-6" />} />
          <StatCard
            label="Rating promedio"
            value={avgRating > 0 ? avgRating.toFixed(1) : '—'}
            icon={<Star className="h-6 w-6" />}
          />
        </div>
      )}

      {/* Reservas recientes */}
      <section id="reservas" className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Reservas recientes</h2>

        {loadingBookings ? (
          <div className="animate-pulse flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            Aún no tienes reservas recibidas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-3 pr-4">Propiedad</th>
                  <th className="pb-3 pr-4">Huésped</th>
                  <th className="pb-3 pr-4">Fechas</th>
                  <th className="pb-3 pr-4 text-right">Total</th>
                  <th className="pb-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="py-3">
                    <td className="py-3 pr-4 font-medium text-gray-800 max-w-[160px] truncate">
                      {booking.propertyTitle}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{booking.guestName}</td>
                    <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                      {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold text-coral">
                      {formatPrice(booking.totalPrice)}
                    </td>
                    <td className="py-3">
                      <Badge variant={statusVariant[booking.status]}>
                        {statusLabel[booking.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Mis propiedades — acceso rápido */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark">Mis propiedades</h2>
          <Link
            to="/host/properties"
            className="text-sm text-coral hover:underline font-medium"
          >
            Ver todas →
          </Link>
        </div>

        {loadingProps ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : quickProperties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-3">
              Aún no tienes propiedades.
            </p>
            <Link
              to="/host/properties/new"
              className="inline-block bg-[#1e3a5f] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#163152] transition-colors"
            >
              + Crear primera propiedad
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickProperties.map((property) => (
              <div
                key={property.id}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <div className="h-32 overflow-hidden">
                  <PropertyImage
                    imageUrl={property.imageUrl}
                    title={property.title}
                    id={property.id}
                    variant="card"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {property.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />{property.location}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Link
                      to={`/host/properties/${property.id}/edit`}
                      className="flex-1 text-center text-xs bg-coral text-white px-2 py-1.5 rounded-lg hover:bg-coral-dark transition-colors"
                    >
                      Editar
                    </Link>
                    <Link
                      to={`/host/properties/${property.id}/availability`}
                      className="flex-1 text-center text-xs border border-coral text-coral px-2 py-1.5 rounded-lg hover:bg-coral/5 transition-colors"
                    >
                      Disponibilidad
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
