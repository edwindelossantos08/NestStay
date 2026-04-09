import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'

export default function Navbar() {
  const { isAuthenticated, user, hasRole, logout } = useAuth()
  // Polling cada 30 segundos para el badge de notificaciones
  const { data: notificationsData } = useNotifications()
  const unreadCount = notificationsData?.unreadCount ?? 0

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-rose-500">
          NestStay
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/properties/search" className="text-sm text-gray-600 hover:text-gray-900">
                Buscar
              </Link>
              {hasRole('Host') && (
                <Link to="/host/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Mi panel
                </Link>
              )}
              {hasRole('Guest') && (
                <Link to="/my-bookings" className="text-sm text-gray-600 hover:text-gray-900">
                  Mis reservas
                </Link>
              )}

              {/* Icono de campana con badge de notificaciones no leídas */}
              <Link to="/notifications" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
                    {user?.userName}
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    className="z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
                  >
                    <DropdownMenu.Item
                      onSelect={logout}
                      className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 outline-none"
                    >
                      Cerrar sesión
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
              >
                Registro
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
