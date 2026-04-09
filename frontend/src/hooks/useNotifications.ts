import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../api/notifications.api'
import { reviewsApi } from '../api/reviews.api'
import { useAuth } from './useAuth'
import type { CreateReviewRequest } from '../types/review.types'

export const useNotifications = () => {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll().then((r) => r.data.data),
    enabled: isAuthenticated,
    // Refresca cada 30 segundos para polling de notificaciones
    refetchInterval: 1000 * 30,
  })
}

export const useUnreadNotifications = () => {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getUnread().then((r) => r.data.data),
    enabled: isAuthenticated,
    // Polling cada 30 segundos para el badge del navbar
    refetchInterval: 1000 * 30,
  })
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewsApi.create(data),
    onSuccess: () => {
      // Invalida las queries de reservas y reseñas al crear una nueva
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
    },
  })
}
