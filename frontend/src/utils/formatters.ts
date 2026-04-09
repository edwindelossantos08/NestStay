import { format, formatDistanceToNow, differenceInCalendarDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Formatea precio en USD: $120.00 / noche
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price) + ' / noche'
}

// Formatea fecha: 15 de marzo de 2026
export const formatDate = (date: string): string => {
  return format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: es })
}

// Calcula noches entre dos fechas
export const calculateNights = (checkIn: string, checkOut: string): number => {
  return differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))
}

// Tiempo relativo: "hace 2 horas"
export const timeAgo = (date: string): string => {
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: es })
}
