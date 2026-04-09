import apiClient from './axios'
import type { ApiResponse } from '../types/api.types'
import type { NotificationListResponse } from '../types/notification.types'

export const notificationsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<NotificationListResponse>>('/api/notifications'),

  getUnread: () =>
    apiClient.get<ApiResponse<NotificationListResponse>>(
      '/api/notifications/unread'
    ),

  markAsRead: (id: number) =>
    apiClient.put<ApiResponse<string>>(`/api/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put<ApiResponse<string>>('/api/notifications/read-all'),
}
