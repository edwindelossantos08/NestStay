import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Menu, X, Home, Search, LayoutDashboard, CalendarCheck, LogOut, User } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import Button from '../ui/Button'

export default function Navbar() {
  const { isAuthenticated, user, hasRole, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  // Polling cada 30 segundos para el badge de notificaciones
  const { data: notificationsData } = useNotifications()
  const unreadCount = notificationsData?.unreadCount ?? 0

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xl font-bold text-navy hover:text-navy-dark transition-colors"
        >
          <Home className="h-5 w-5 text-gold" />
          NestStay
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/properties/search"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-navy transition-colors"
              >
                <Search className="h-4 w-4" />
                Buscar
              </Link>

              {hasRole('Host') && (
                <Link
                  to="/host/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-navy transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Mi panel
                </Link>
              )}

              {hasRole('Guest') && (
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-navy transition-colors"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Mis reservas
                </Link>
              )}

              {/* Campana con badge */}
              <Link to="/notifications" className="relative text-gray-600 hover:text-navy transition-colors">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Dropdown del usuario */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-navy hover:text-navy transition-colors">
                    <User className="h-4 w-4" />
                    {user?.userName}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 min-w-[180px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
                  >
                    <DropdownMenu.Item
                      onSelect={() => navigate('/notifications')}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 outline-none"
                    >
                      <Bell className="h-4 w-4 text-gray-400" />
                      Notificaciones
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 border-t border-gray-100" />
                    <DropdownMenu.Item
                      onSelect={handleLogout}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 outline-none"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Botón hamburguesa — solo móvil */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          {isAuthenticated ? (
            <div className="flex flex-col gap-1">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {user?.userName}
              </p>
              <Link
                to="/properties/search"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Search className="h-4 w-4 text-gray-400" />
                Buscar alojamientos
              </Link>
              {hasRole('Host') && (
                <Link
                  to="/host/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LayoutDashboard className="h-4 w-4 text-gray-400" />
                  Mi panel de host
                </Link>
              )}
              {hasRole('Guest') && (
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <CalendarCheck className="h-4 w-4 text-gray-400" />
                  Mis reservas
                </Link>
              )}
              <Link
                to="/notifications"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Bell className="h-4 w-4 text-gray-400" />
                Notificaciones
                {unreadCount > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <div className="mt-1 border-t border-gray-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="md" className="w-full">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
