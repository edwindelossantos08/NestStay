import { useState, useMemo } from 'react'
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isBefore, isAfter, isSameDay,
  startOfWeek, endOfWeek, isWithinInterval,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface DateRangePickerProps {
  checkIn: string      // 'YYYY-MM-DD' | ''
  checkOut: string     // 'YYYY-MM-DD' | ''
  minDate?: string     // 'YYYY-MM-DD', defaults to today
  onCheckInChange: (date: string) => void
  onCheckOutChange: (date: string) => void
}

function toLocalDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toDateStr(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  minDate,
  onCheckInChange,
  onCheckOutChange,
}: DateRangePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const min = minDate ? toLocalDate(minDate) : today

  const [currentMonth, setCurrentMonth] = useState<Date>(
    checkIn ? startOfMonth(toLocalDate(checkIn)) : startOfMonth(today),
  )
  const [hovered, setHovered] = useState<Date | null>(null)

  const nextMonth = addMonths(currentMonth, 1)

  const checkInDate = checkIn ? toLocalDate(checkIn) : null
  const checkOutDate = checkOut ? toLocalDate(checkOut) : null

  const handleDayClick = (day: Date) => {
    if (isBefore(day, min)) return

    // If no check-in or we already have both → start fresh
    if (!checkInDate || (checkInDate && checkOutDate)) {
      onCheckInChange(toDateStr(day))
      onCheckOutChange('')
      return
    }

    // We have check-in, no check-out
    if (isBefore(day, checkInDate) || isSameDay(day, checkInDate)) {
      // Clicked before/same as check-in → reset with new check-in
      onCheckInChange(toDateStr(day))
      onCheckOutChange('')
    } else {
      onCheckOutChange(toDateStr(day))
    }
  }

  const clearDates = () => {
    onCheckInChange('')
    onCheckOutChange('')
  }

  const rangeEnd = !checkOutDate && hovered && checkInDate ? hovered : checkOutDate

  function renderMonth(monthDate: Date) {
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: calStart, end: calEnd })

    return (
      <div key={monthDate.toISOString()} className="flex-1 min-w-0">
        <p className="text-center text-sm font-semibold text-dark mb-3">
          {format(monthDate, 'MMMM yyyy', { locale: es })}
        </p>
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {['Lu','Ma','Mi','Ju','Vi','Sa','Do'].map(d => (
            <span key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</span>
          ))}
        </div>
        {/* Days grid */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const isCurrentMonth = day.getMonth() === monthDate.getMonth()
            const isPast = isBefore(day, min)
            const isStart = checkInDate ? isSameDay(day, checkInDate) : false
            const isEnd = checkOutDate ? isSameDay(day, checkOutDate) : false
            const isInRange =
              checkInDate && rangeEnd && !isSameDay(checkInDate, day) && !isSameDay(rangeEnd, day)
                ? isWithinInterval(day, {
                    start: isBefore(checkInDate, rangeEnd) ? checkInDate : rangeEnd,
                    end: isBefore(checkInDate, rangeEnd) ? rangeEnd : checkInDate,
                  })
                : false

            const isToday = isSameDay(day, today)

            let dayClass = 'relative flex items-center justify-center h-9 text-sm cursor-pointer select-none'

            if (!isCurrentMonth) {
              dayClass += ' opacity-0 pointer-events-none'
            } else if (isPast) {
              dayClass += ' text-gray-300 cursor-not-allowed'
            } else if (isStart || isEnd) {
              dayClass += ' text-white font-semibold z-10'
            } else if (isInRange) {
              dayClass += ' text-dark'
            } else if (isToday) {
              dayClass += ' font-semibold text-coral'
            } else {
              dayClass += ' text-dark hover:text-dark'
            }

            // Background
            let bgClass = ''
            if (isCurrentMonth && !isPast) {
              if (isStart) bgClass = 'bg-dark rounded-full'
              else if (isEnd) bgClass = 'bg-dark rounded-full'
              else if (isInRange) bgClass = 'bg-coral/10'
              else bgClass = 'rounded-full hover:bg-gray-100'
            }

            // Range connectors
            let rangeExtend = ''
            if (isCurrentMonth && !isPast && isInRange) {
              rangeExtend = 'bg-coral/10'
            }
            if (isCurrentMonth && !isPast && isStart && checkInDate && rangeEnd && !isSameDay(checkInDate, rangeEnd)) {
              rangeExtend = isAfter(rangeEnd, checkInDate)
                ? 'after:absolute after:inset-y-0 after:right-0 after:w-1/2 after:bg-coral/10 after:z-0'
                : 'after:absolute after:inset-y-0 after:left-0 after:w-1/2 after:bg-coral/10 after:z-0'
            }
            if (isCurrentMonth && !isPast && isEnd && checkInDate && rangeEnd && !isSameDay(checkInDate, rangeEnd)) {
              rangeExtend = isAfter(rangeEnd, checkInDate)
                ? 'after:absolute after:inset-y-0 after:left-0 after:w-1/2 after:bg-coral/10 after:z-0'
                : 'after:absolute after:inset-y-0 after:right-0 after:w-1/2 after:bg-coral/10 after:z-0'
            }

            return (
              <div
                key={day.toISOString()}
                className={`relative ${isInRange ? 'bg-coral/10' : ''}`}
                onMouseEnter={() => !isPast && isCurrentMonth && setHovered(day)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => isCurrentMonth && handleDayClick(day)}
              >
                <div className={`${dayClass} ${rangeExtend}`}>
                  <span className={`relative z-10 flex items-center justify-center h-9 w-9 ${bgClass} transition-colors duration-100`}>
                    {format(day, 'd')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const summary = useMemo(() => {
    if (!checkIn && !checkOut) return null
    const ci = checkIn ? format(toLocalDate(checkIn), 'd MMM', { locale: es }) : '—'
    const co = checkOut ? format(toLocalDate(checkOut), 'd MMM', { locale: es }) : '—'
    if (!checkOut) return `Check-in: ${ci} · Selecciona salida`
    return `${ci} → ${co}`
  }, [checkIn, checkOut])

  // clickable summary badges on top
  const selectingCheckout = !!(checkInDate && !checkOutDate)

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            onCheckInChange('')
            onCheckOutChange('')
          }}
          className={`flex-1 py-3 px-4 text-xs font-semibold text-left border-r border-gray-200 transition-colors ${
            !selectingCheckout ? 'bg-white text-dark' : 'bg-gray-50 text-gray-500'
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check-in</span>
          {checkIn ? format(toLocalDate(checkIn), 'd MMM yyyy', { locale: es }) : 'Añade fecha'}
        </button>
        <button
          className={`flex-1 py-3 px-4 text-xs font-semibold text-left transition-colors ${
            selectingCheckout ? 'bg-white text-dark' : 'bg-gray-50 text-gray-500'
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check-out</span>
          {checkOut ? format(toLocalDate(checkOut), 'd MMM yyyy', { locale: es }) : 'Añade fecha'}
        </button>
      </div>

      {/* Calendar navigation */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            aria-label="Mes anterior"
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            disabled={!isAfter(currentMonth, min)}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            aria-label="Mes siguiente"
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Two-month calendar grid */}
        <div className="flex gap-6">
          {renderMonth(currentMonth)}
          <div className="hidden sm:block w-px bg-gray-200 shrink-0" />
          <div className="hidden sm:block flex-1 min-w-0">
            {renderMonth(nextMonth)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
        <span>{summary ?? 'Selecciona las fechas'}</span>
        {(checkIn || checkOut) && (
          <button
            onClick={clearDates}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-dark underline transition-colors"
          >
            <X className="h-3 w-3" />
            Limpiar fechas
          </button>
        )}
      </div>
    </div>
  )
}
