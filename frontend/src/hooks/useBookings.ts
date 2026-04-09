import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '../api/bookings.api'

export const useMyBookings = () =>
  useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: () => bookingsApi.getMyBookings().then((r) => r.data.data),
  })
