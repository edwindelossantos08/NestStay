import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Home } from 'lucide-react'
import { useSearchProperties } from '../../hooks/useProperties'
import PropertyCard from '../../components/shared/PropertyCard'
import CategoryBar from '../../components/shared/CategoryBar'

// Skeleton de card mientras carga — mismo tamaño que PropertyCard
const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-xl" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
      <div className="h-9 bg-gray-200 rounded-lg mt-1" />
    </div>
  </div>
)

export default function HomePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    capacity: '',
  })
  const [activeCategory, setActiveCategory] = useState('all')

  // Carga propiedades sin filtros para el listado de la home
  const { data: searchResult, isLoading } = useSearchProperties({})

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (form.location) params.set('location', form.location)
    if (form.checkIn) params.set('checkIn', form.checkIn)
    if (form.checkOut) params.set('checkOut', form.checkOut)
    if (form.capacity) params.set('capacity', form.capacity)
    navigate(`/properties/search?${params.toString()}`)
  }

  const properties = searchResult?.properties ?? []

  return (
    <div className="min-h-screen bg-white">
      {/* Sección hero con buscador */}
      <section className="bg-gradient-to-br from-dark to-[#111] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Encuentra tu lugar perfecto
          </h1>
          <p className="text-white/75 text-lg mb-10">
            Alojamientos únicos para cada viaje
          </p>

          {/* Card buscador */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-xl p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Destino */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  ¿A dónde?
                </label>
                <input
                  type="text"
                  placeholder="Ciudad, país..."
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
              </div>

              {/* Check-in */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Llegada
                </label>
                <input
                  type="date"
                  value={form.checkIn}
                  onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
              </div>

              {/* Check-out */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Salida
                </label>
                <input
                  type="date"
                  value={form.checkOut}
                  onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
              </div>

              {/* Huéspedes */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> Huéspedes
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="¿Cuántos?"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full md:w-auto md:px-12 bg-coral hover:bg-coral-dark text-white font-semibold py-2.5 px-8 rounded-xl transition-colors duration-200"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Barra de categorías */}
      <CategoryBar onChange={setActiveCategory} />

      {/* Sección listado de propiedades */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-dark mb-6">
          Propiedades disponibles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            : properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
        </div>

        {/* Estado vacío */}
        {!isLoading && properties.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Home className="h-16 w-16 mx-auto text-gray-200 mb-4" />
            <p className="text-lg font-medium">No hay propiedades disponibles</p>
            <p className="text-sm mt-1">Vuelve pronto, ¡se están agregando más!</p>
          </div>
        )}
      </section>
    </div>
  )
}
