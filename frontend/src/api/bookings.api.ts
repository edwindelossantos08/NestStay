import apiClient from './axios'
import type { ApiResponse } from '../types/api.types'
import type {
  BookingResponse,
  CreateBookingRequest,
  CancelBookingResponse,
  CompleteBookingResponse,
} from '../types/booking.types'

export const bookingsApi = {
  create: (data: CreateBookingRequest) =>
    apiClient.post<ApiResponse<BookingResponse>>('/api/bookings', data),

  cancel: (id: number) =>
    apiClient.post<ApiResponse<CancelBookingResponse>>(
      `/api/bookings/${id}/cancel`
    ),

  complete: (id: number) =>
    apiClient.post<ApiResponse<CompleteBookingResponse>>(
      `/api/bookings/${id}/complete`
    ),

  getMyBookings: (status?: string) =>
    apiClient.get<ApiResponse<BookingResponse[]>>('/api/bookings/my-bookings', {
      params: status ? { status } : {},
    }),

  getReceivedBookings: (status?: string) =>
    apiClient.get<ApiResponse<BookingResponse[]>>('/api/bookings/received', {
      params: status ? { status } : {},
    }),
}
