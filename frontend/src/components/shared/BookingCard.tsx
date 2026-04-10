import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Home, MapPin, Calendar, Moon, DollarSign, CheckCircle, Star } from 'lucide-react'
import type { BookingResponse } from '../../types/booking.types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { calculateNights } from '../../utils/formatters'

interface BookingCardProps {
  booking: BookingResponse
  onCancel?: (id: number) => void
  onComplete?: (id: number) => void
  onReview?: (booking: BookingResponse) => void
}

// Formato corto de fecha: "15 mar 2026"
const formatShortDate = (date: string) =>
  format(parseISO(date), 'd MMM yyyy', { locale: es })

export default function BookingCard({
  booking,
  onCancel,
  onComplete,
  onReview,
}: BookingCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Compara fecha de hoy con checkout para saber si ya pasó
  const today = new Date().toISOString().split('T')[0]
  const checkoutPassed = booking.checkOut < today
  const nights = calculateNights(booking.checkIn, booking.checkOut)

  const handleConfirmCancel = () => {
    setShowCancelModal(false)
    onCancel?.(booking.id)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/80 p-6">
      {/* Header: título y badge de estado */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-dark text-base flex items-center gap-2">
            <Home className="h-4 w-4 text-coral shrink-0" />
            {booking.propertyTitle}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {booking.propertyLocation}
          </p>
        </div>
        <div className="shrink-0">
          {booking.status === 'Confirmed' && (
            <Badge variant="confirmed" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Confirmada
            </Badge>
          )}
          {booking.status === 'Cancelled' && (
            <Badge variant="cancelled">Cancelada</Badge>
          )}
          {booking.status === 'Completed' && (
            <Badge variant="completed">Completada</Badge>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 my-3" />

      {/* Detalles de fechas y precio */}
      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
        <p className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          Entrada: <span className="font-medium">{formatShortDate(booking.checkIn)}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          Salida: <span className="font-medium">{formatShortDate(booking.checkOut)}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <Moon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          {nights} {nights === 1 ? 'noche' : 'noches'}
        </p>
        <p className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          Total: <span className="font-semibold text-dark">${booking.totalPrice.toFixed(2)}</span>
        </p>
      </div>

      {/* Botones de acción según estado */}
      {booking.status !== 'Cancelled' && (
        <>
          <div className="border-t border-gray-100 my-3" />
          <div className="flex flex-wrap gap-2">
            {booking.status === 'Confirmed' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancelar reserva
                </Button>
                {/* Solo mostrar si el checkout ya pasó */}
                {checkoutPassed && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onComplete?.(booking.id)}
                  >
                    Marcar completada
                  </Button>
                )}
              </>
            )}
            {booking.status === 'Completed' && onReview && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onReview(booking)}
                className="flex items-center gap-1.5"
              >
                <Star className="h-4 w-4" />
                Dejar reseña
              </Button>
            )}
          </div>
        </>
      )}

      {/* Modal de confirmación de cancelación */}
      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="¿Cancelar reserva?"
      >
        <p className="text-sm text-gray-600">
          Esta acción liberará las fechas reservadas.
        </p>
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowCancelModal(false)}
          >
            No, mantener
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={handleConfirmCancel}
          >
            Sí, cancelar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
