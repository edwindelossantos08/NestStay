import apiClient from './axios'
import type { BookingResponse, CreateBookingRequest } from '../types/booking.types'
import type { ApiResponse } from '../types/api.types'

export const bookingsApi = {
  create: (data: CreateBookingRequest) =>
    apiClient.post<ApiResponse<BookingResponse>>('/api/bookings', data),

  getMyBookings: () =>
    apiClient.get<ApiResponse<BookingResponse[]>>('/api/bookings/my-bookings'),

  cancel: (id: number) =>
    apiClient.post<ApiResponse<BookingResponse>>(`/api/bookings/${id}/cancel`),

  complete: (id: number) =>
    apiClient.post<ApiResponse<BookingResponse>>(`/api/bookings/${id}/complete`),
}
