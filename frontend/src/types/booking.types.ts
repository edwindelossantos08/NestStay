export type BookingStatus = 'Confirmed' | 'Cancelled' | 'Completed'

export interface BookingResponse {
  id: number
  propertyId: number
  propertyTitle: string
  propertyLocation: string
  guestId: number
  guestName: string
  checkIn: string
  checkOut: string
  status: BookingStatus
  totalPrice: number
  createdAt: string
}

export interface CreateBookingRequest {
  propertyId: number
  checkIn: string
  checkOut: string
}

export interface CancelBookingResponse {
  bookingId: number
  message: string
  status: string
}

export interface CompleteBookingResponse {
  bookingId: number
  message: string
  status: string
}
