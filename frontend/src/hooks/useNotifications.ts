import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '../api/notifications.api'
import { useAuth } from './useAuth'

export const useNotifications = () => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll().then((r) => r.data.data),
    enabled: isAuthenticated,
    // Polling cada 30 segundos para mantener el badge actualizado
    refetchInterval: 30_000,
  })
}
