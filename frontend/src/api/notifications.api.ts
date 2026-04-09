import apiClient from './axios'
import type { NotificationListResponse } from '../types/notification.types'
import type { ApiResponse } from '../types/api.types'

export const notificationsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<NotificationListResponse>>('/api/notifications'),

  markAsRead: (id: number) =>
    apiClient.post<ApiResponse<null>>(`/api/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.post<ApiResponse<null>>('/api/notifications/read-all'),
}
