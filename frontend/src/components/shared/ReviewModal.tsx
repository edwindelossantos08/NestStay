import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { BookingResponse } from '../../types/booking.types'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import StarRating from './StarRating'
import { useCreateReview } from '../../hooks/useNotifications'
import { useToast } from '../../context/ToastContext'

const schema = z.object({
  rating: z.number().min(1, 'Selecciona una calificación').max(5),
  comment: z
    .string()
    .min(10, 'El comentario debe tener al menos 10 caracteres')
    .max(500, 'El comentario no puede superar 500 caracteres'),
})

type ReviewForm = z.infer<typeof schema>

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingResponse | null
}

// Formato corto de fecha: "15 mar"
const fmtShort = (date: string) => format(parseISO(date), 'd MMM', { locale: es })

export default function ReviewModal({ isOpen, onClose, booking }: ReviewModalProps) {
  const toast = useToast()
  const { mutate: createReview, isPending, isError, error } = useCreateReview()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, comment: '' },
  })

  const rating = watch('rating')
  const comment = watch('comment')

  // Resetea el formulario cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) reset({ rating: 0, comment: '' })
  }, [isOpen, reset])

  const onSubmit = (data: ReviewForm) => {
    if (!booking) return
    createReview(
      { bookingId: booking.id, rating: data.rating, comment: data.comment },
      {
        onSuccess: () => {
          toast.success('Reseña publicada', '¡Gracias por tu comentario!')
          onClose()
        },
      }
    )
  }

  // Extrae el mensaje de error del backend si existe
  const backendError = isError
    ? (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message
    : null

  return (
    <Modal open={isOpen} onClose={onClose} title="Dejar reseña">
      {booking && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Resumen de la reserva */}
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-1 text-sm">
            <p className="font-medium text-gray-800">🏠 {booking.propertyTitle}</p>
            <p className="text-gray-500">
              📅 {fmtShort(booking.checkIn)} – {fmtShort(booking.checkOut)}{' '}
              {new Date(booking.checkOut).getFullYear()}
            </p>
          </div>

          {/* StarRating interactivo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Tu calificación
            </label>
            <StarRating
              rating={rating}
              size="md"
              interactive
              onChange={(value) =>
                setValue('rating', value, { shouldValidate: true })
              }
            />
            {errors.rating && (
              <p className="text-xs text-red-600">{errors.rating.message}</p>
            )}
          </div>

          {/* Textarea con contador de caracteres */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Comentario
            </label>
            <textarea
              {...register('comment')}
              rows={4}
              placeholder="Cuéntanos tu experiencia..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 resize-none"
            />
            <div className="flex items-center justify-between">
              {errors.comment ? (
                <p className="text-xs text-red-600">{errors.comment.message}</p>
              ) : (
                <span />
              )}
              {/* Contador de caracteres en tiempo real */}
              <p className="text-xs text-gray-400">{comment.length} / 500 caracteres</p>
            </div>
          </div>

          {/* Error del backend */}
          {backendError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {backendError}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isPending}
            >
              Publicar reseña
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
