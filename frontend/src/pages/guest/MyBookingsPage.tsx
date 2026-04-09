import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BookingStatus, BookingResponse } from '../../types/booking.types'
import { useMyBookings, useCancelBooking, useCompleteBooking } from '../../hooks/useBookings'
import { useToast } from '../../context/ToastContext'
import BookingCard from '../../components/shared/BookingCard'
import ReviewModal from '../../components/shared/ReviewModal'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ErrorMessage from '../../components/shared/ErrorMessage'
import Button from '../../components/ui/Button'

type TabValue = 'all' | BookingStatus

const TABS: { value: TabValue; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'Confirmed', label: 'Confirmadas' },
  { value: 'Cancelled', label: 'Canceladas' },
  { value: 'Completed', label: 'Completadas' },
]

const EMPTY_MESSAGES: Record<TabValue, string> = {
  all: 'No tienes reservas aún',
  Confirmed: 'No tienes reservas confirmadas',
  Cancelled: 'No tienes reservas canceladas',
  Completed: 'No tienes reservas completadas',
}

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [selectedTab, setSelectedTab] = useState<TabValue>('all')
  const [reviewBooking, setReviewBooking] = useState<BookingResponse | null>(null)

  // Carga todas las reservas una vez — el filtro por tab se hace en memoria
  const { data: bookings = [], isLoading, isError } = useMyBookings()
  const { mutate: cancelBooking } = useCancelBooking()
  const { mutate: completeBooking } = useCompleteBooking()

  const filtered = bookings.filter((b) =>
    selectedTab === 'all' ? true : b.status === selectedTab
  )

  const handleCancel = (id: number) => {
    cancelBooking(id, {
      onSuccess: () =>
        toast.success('Reserva cancelada', 'Las fechas han sido liberadas.'),
      onError: () =>
        toast.error('Error', 'No se pudo cancelar la reserva. Intenta de nuevo.'),
    })
  }

  const handleComplete = (id: number) => {
    completeBooking(id, {
      onSuccess: () =>
        toast.success('Reserva completada', 'La reserva fue marcada como completada.'),
      onError: () =>
        toast.error('Error', 'No se pudo completar la reserva. Intenta de nuevo.'),
    })
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">Mis reservas</h1>

        {/* Tabs de filtro por estado */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTab === tab.value
                  ? 'bg-white text-[#1e3a5f] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido principal */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : isError ? (
          <ErrorMessage message="No se pudieron cargar tus reservas." />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-600 font-medium">{EMPTY_MESSAGES[selectedTab]}</p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => navigate('/properties/search')}
            >
              Buscar propiedades
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                onComplete={handleComplete}
                onReview={setReviewBooking}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de reseña */}
      <ReviewModal
        isOpen={reviewBooking !== null}
        onClose={() => setReviewBooking(null)}
        booking={reviewBooking}
      />
    </div>
  )
}
