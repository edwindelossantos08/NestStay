import { useState } from 'react'
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '../../hooks/useNotifications'
import { useToast } from '../../context/ToastContext'
import { timeAgo } from '../../utils/formatters'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import Button from '../../components/ui/Button'

export default function NotificationsPage() {
  const toast = useToast()
  // IDs que se marcaron como leídos de forma optimista antes de la respuesta del servidor
  const [optimisticRead, setOptimisticRead] = useState<Set<number>>(new Set())

  const { data, isLoading } = useNotifications()
  const { mutate: markAsRead } = useMarkAsRead()
  const { mutate: markAllAsRead, isPending: markingAll } = useMarkAllAsRead()

  // Ordena por fecha descendente (más recientes primero)
  const notifications = [...(data?.notifications ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const hasUnread = notifications.some(
    (n) => !n.isRead && !optimisticRead.has(n.id)
  )

  const handleMarkAsRead = (id: number, isAlreadyRead: boolean) => {
    if (isAlreadyRead || optimisticRead.has(id)) return
    // Actualiza visualmente de inmediato sin esperar al servidor (optimistic update)
    setOptimisticRead((prev) => new Set(prev).add(id))
    markAsRead(id, {
      onError: () => {
        // Revierte si el servidor responde con error
        setOptimisticRead((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      },
    })
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        setOptimisticRead(new Set())
        toast.success('Listo', 'Todas las notificaciones marcadas como leídas.')
      },
      onError: () =>
        toast.error('Error', 'No se pudieron marcar las notificaciones.'),
    })
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Notificaciones</h1>
          {/* Solo visible si hay notificaciones sin leer */}
          {hasUnread && (
            <Button
              variant="outline"
              size="sm"
              isLoading={markingAll}
              onClick={handleMarkAllAsRead}
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-gray-600">No tienes notificaciones</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((notification) => {
              const isRead =
                notification.isRead || optimisticRead.has(notification.id)
              return (
                <div
                  key={notification.id}
                  onClick={() =>
                    handleMarkAsRead(notification.id, notification.isRead)
                  }
                  className={`rounded-xl p-4 transition-all cursor-pointer ${
                    isRead
                      ? 'bg-gray-50 opacity-75'
                      : 'bg-white border-l-4 border-[#c9a84c] shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-lg shrink-0">🔔</span>
                      <p
                        className={`text-sm leading-relaxed ${
                          isRead ? 'text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-xs text-gray-400">
                        {timeAgo(notification.createdAt)}
                      </span>
                      {/* Punto azul para notificaciones no leídas */}
                      {!isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
