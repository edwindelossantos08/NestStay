import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell, Menu, X, Search, LayoutDashboard, CalendarCheck, LogOut,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import Button from '../ui/Button'

/** Up to 2 initials from a display name */
const getInitials = (name?: string): string => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Deterministic avatar background based on first char */
const AVATAR_COLORS = [
  'bg-[#1e3a5f]', 'bg-[#c9a84c]', 'bg-[#2d6a4f]',
  'bg-[#6d3a8a]', 'bg-[#c1440e]', 'bg-[#1a7fa1]',
]
const avatarColor = (name?: string): string => {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

export default function Navbar() {
  const { isAuthenticated, user, hasRole, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const { data: notificationsData } = useNotifications()
  const unreadCount = notificationsData?.unreadCount ?? 0

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
  }

  const handleSearchPillClick = () => {
    navigate('/properties/search')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1.5 text-xl font-bold text-coral hover:text-coral-dark transition-colors"
        >
          {/* NestStay SVG house icon */}
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-coral">
            <path d="M16 1l-15 14h4v16h22V15h4L16 1zm0 3.3l11 10.3V29H5V14.6L16 4.3zM13 29V20h6v9h-6z" />
          </svg>
          <span className="hidden sm:inline">NestStay</span>
        </Link>

        {/* Search Pill — centro */}
        <button
          onClick={handleSearchPillClick}
          className="hidden md:flex flex-1 max-w-md items-center gap-0 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden text-sm font-medium text-gray-700"
          aria-label="Abrir búsqueda"
        >
          <span className="px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
            ¿A dónde?
          </span>
          <span className="px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
            Fechas
          </span>
          <span className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors">
            Huéspedes
          </span>
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-coral text-white shrink-0 mx-2">
            <Search className="h-4 w-4" />
          </span>
        </button>

        {/* Controles derecha — desktop */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              {/* Campana */}
              <Link to="/notifications" className="relative text-gray-600 hover:text-coral transition-colors p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Dropdown hamburguesa + avatar */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:shadow-md transition-shadow duration-200">
                    <Menu className="h-4 w-4" />
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold select-none ${avatarColor(user?.userName)}`}
                    >
                      {getInitials(user?.userName)}
                    </div>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 min-w-[200px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl"
                  >
                    <div className="px-3 py-2 text-xs text-gray-400 font-medium border-b border-gray-100 mb-1">
                      {user?.userName}
                    </div>
                    <DropdownMenu.Item
                      onSelect={() => navigate('/properties/search')}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 outline-none"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      Buscar alojamientos
                    </DropdownMenu.Item>
                    {hasRole('Guest') && (
                      <DropdownMenu.Item
                        onSelect={() => navigate('/my-bookings')}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 outline-none"
                      >
                        <CalendarCheck className="h-4 w-4 text-gray-400" />
                        Mis reservas
                      </DropdownMenu.Item>
                    )}
                    {hasRole('Host') && (
                      <DropdownMenu.Item
                        onSelect={() => navigate('/host/dashboard')}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 outline-none"
                      >
                        <LayoutDashboard className="h-4 w-4 text-gray-400" />
                        Mi panel
                      </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Item
                      onSelect={() => navigate('/notifications')}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 outline-none"
                    >
                      <Bell className="h-4 w-4 text-gray-400" />
                      Notificaciones
                      {unreadCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
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
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Iniciar sesión</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Registrarse</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Botón búsqueda móvil + hamburguesa */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleSearchPillClick}
            className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Buscar</span>
          </button>
          <button
            className="flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
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
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
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
                <Button variant="outline" size="md" className="w-full">Iniciar sesión</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" className="w-full">Registrarse</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
