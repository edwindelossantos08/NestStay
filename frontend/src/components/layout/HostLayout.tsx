import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Building2, CalendarDays } from 'lucide-react'
import { cn } from '../../utils/cn'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/host/dashboard' },
  { label: 'Mis propiedades', icon: Building2, to: '/host/properties' },
  { label: 'Reservas recibidas', icon: CalendarDays, to: '/host/dashboard#reservas' },
]

export default function HostLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f9fafb]">
      {/* Overlay para cerrar el menú en móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 flex h-full w-60 flex-col bg-[#1e3a5f] text-white transition-transform duration-300',
          'lg:static lg:translate-x-0 lg:z-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Cabecera del sidebar */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <span className="font-bold text-lg tracking-tight">Panel Host</span>
          <button
            className="lg:hidden rounded-lg p-1 hover:bg-white/10"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/40">NestStay · Panel Host</p>
        </div>
      </aside>

      {/* Botón hamburguesa visible solo en móvil */}
      <button
        className="fixed top-4 left-4 z-40 rounded-lg bg-[#1e3a5f] p-2 text-white shadow-md lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
