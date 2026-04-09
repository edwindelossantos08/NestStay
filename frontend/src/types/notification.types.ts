export interface NotificationResponse {
  id: number
  message: string
  isRead: boolean
  createdAt: string
}

export interface NotificationListResponse {
  notifications: NotificationResponse[]
  totalCount: number
  unreadCount: number
}
