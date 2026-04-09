import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '../api/bookings.api'
import type { CreateBookingRequest } from '../types/booking.types'

export const useMyBookings = (status?: string) =>
  useQuery({
    queryKey: ['my-bookings', status],
    queryFn: () => bookingsApi.getMyBookings(status).then((r) => r.data.data),
  })

export const useReceivedBookings = (status?: string) =>
  useQuery({
    queryKey: ['received-bookings', status],
    queryFn: () =>
      bookingsApi.getReceivedBookings(status).then((r) => r.data.data),
  })

export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] }),
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => bookingsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['received-bookings'] })
    },
  })
}

export const useCompleteBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => bookingsApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
    },
  })
}
