import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isBefore,
  isToday,
  isSameDay,
  parseISO,
  startOfDay,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { usePropertyAvailability, useBlockDates, useUnblockDates } from '../../hooks/useProperties'
import { useToast } from '../../context/ToastContext'

// Formatea como YYYY-MM-DD para comparar con las listas de la API
const toDateString = (date: Date): string => format(date, 'yyyy-MM-dd')

export default function AvailabilityPage() {
  const { id } = useParams<{ id: string }>()
  const propertyId = Number(id)

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [pendingBlock, setPendingBlock] = useState<string[]>([])
  const [pendingUnblock, setPendingUnblock] = useState<string[]>([])

  const toast = useToast()

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth() + 1

  const { data: availability, isLoading } = usePropertyAvailability(
    propertyId,
    year,
    month
  )

  const { mutate: blockDates, isPending: blocking } = useBlockDates(propertyId)
  const { mutate: unblockDates, isPending: unblocking } = useUnblockDates(propertyId)

  // Días del mes actual para construir el calendario
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Offset para alinear el primer día con el día correcto de la semana (Lunes = 0)
  const startOffset = (getDay(monthStart) + 6) % 7

  const today = startOfDay(new Date())

  const handleDayClick = (date: Date) => {
    if (isBefore(date, today)) return // Días pasados no son clickeables

    const dateStr = toDateString(date)

    // Determina el estado actual del día
    const isBooked = availability?.bookedDates.some((d) =>
      isSameDay(parseISO(d), date)
    )
    if (isBooked) return // Fechas reservadas no son clickeables

    const isBlocked =
      availability?.blockedDates.some((d) => isSameDay(parseISO(d), date)) ||
      pendingBlock.includes(dateStr)

    const isPendingUnblock = pendingUnblock.includes(dateStr)

    if (isBlocked && !isPendingUnblock) {
      // Disponible → pasa a desbloquear
      setPendingUnblock((prev) => [...prev, dateStr])
      setPendingBlock((prev) => prev.filter((d) => d !== dateStr))
    } else if (isPendingUnblock) {
      // Cancela el desbloqueo pendiente
      setPendingUnblock((prev) => prev.filter((d) => d !== dateStr))
    } else {
      // Disponible → pasa a bloquear
      if (pendingBlock.includes(dateStr)) {
        setPendingBlock((prev) => prev.filter((d) => d !== dateStr))
      } else {
        setPendingBlock((prev) => [...prev, dateStr])
      }
    }
  }

  const handleSave = async () => {
    const hasChanges = pendingBlock.length > 0 || pendingUnblock.length > 0
    if (!hasChanges) return

    let success = true

    if (pendingBlock.length > 0) {
      await new Promise<void>((resolve) => {
        blockDates(pendingBlock, {
          onSuccess: () => resolve(),
          onError: () => {
            success = false
            resolve()
          },
        })
      })
    }

    if (pendingUnblock.length > 0) {
      await new Promise<void>((resolve) => {
        unblockDates(pendingUnblock, {
          onSuccess: () => resolve(),
          onError: () => {
            success = false
            resolve()
          },
        })
      })
    }

    if (success) {
      toast.success('Disponibilidad actualizada', 'Los cambios se guardaron correctamente.')
      setPendingBlock([])
      setPendingUnblock([])
    } else {
      toast.error('Error al guardar', 'No se pudieron guardar algunos cambios.')
    }
  }

  const getDayState = (date: Date): 'past' | 'booked' | 'blocked' | 'pending-unblock' | 'pending-block' | 'available' => {
    if (isBefore(date, today) && !isToday(date)) return 'past'

    const dateStr = toDateString(date)

    if (availability?.bookedDates.some((d) => isSameDay(parseISO(d), date)))
      return 'booked'

    if (pendingUnblock.includes(dateStr)) return 'pending-unblock'
    if (pendingBlock.includes(dateStr)) return 'pending-block'

    if (availability?.blockedDates.some((d) => isSameDay(parseISO(d), date)))
      return 'blocked'

    return 'available'
  }

  const dayStyles: Record<string, string> = {
    past: 'bg-gray-100 text-gray-300 cursor-not-allowed',
    booked: 'bg-yellow-100 text-yellow-800 cursor-not-allowed border border-yellow-200',
    blocked: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 cursor-pointer',
    'pending-unblock': 'bg-red-50 text-red-400 border border-dashed border-red-300 cursor-pointer',
    'pending-block': 'bg-red-200 text-red-800 border border-red-400 cursor-pointer',
    available: 'bg-green-50 text-green-800 hover:bg-green-100 border border-green-200 cursor-pointer',
  }

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const hasPendingChanges = pendingBlock.length > 0 || pendingUnblock.length > 0
  const isSaving = blocking || unblocking

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <Link to="/host/properties" className="text-sm text-[#1e3a5f] hover:underline">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">
          Disponibilidad
        </h1>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-green-50 border border-green-200 inline-block" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-red-100 border border-red-200 inline-block" />
          Bloqueada (por ti)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200 inline-block" />
          Reservada (huésped)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-gray-100 inline-block" />
          Pasada
        </span>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        {/* Navegación de mes */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            ←
          </button>
          <h2 className="text-base font-semibold text-[#1e3a5f] capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            →
          </button>
        </div>

        {/* Cabecera de días */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-gray-400 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Skeleton mientras carga */}
        {isLoading ? (
          <div className="grid grid-cols-7 gap-1 animate-pulse">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {/* Celdas vacías para el offset del primer día */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Días del mes */}
            {days.map((day) => {
              const state = getDayState(day)
              return (
                <button
                  key={toDateString(day)}
                  onClick={() => handleDayClick(day)}
                  disabled={state === 'past' || state === 'booked'}
                  title={
                    state === 'booked'
                      ? 'Reservada por un huésped'
                      : state === 'blocked'
                      ? 'Click para desbloquear'
                      : state === 'available'
                      ? 'Click para bloquear'
                      : undefined
                  }
                  className={`h-9 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${dayStyles[state]}`}
                >
                  {format(day, 'd')}
                  {isToday(day) && (
                    <span className="sr-only">(hoy)</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Resumen de cambios pendientes */}
      {hasPendingChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          {pendingBlock.length > 0 && (
            <p>• {pendingBlock.length} fecha(s) a bloquear</p>
          )}
          {pendingUnblock.length > 0 && (
            <p>• {pendingUnblock.length} fecha(s) a desbloquear</p>
          )}
        </div>
      )}

      {/* Botón guardar */}
      <button
        onClick={handleSave}
        disabled={!hasPendingChanges || isSaving}
        className="w-full bg-[#1e3a5f] hover:bg-[#163152] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-40"
      >
        {isSaving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  )
}
