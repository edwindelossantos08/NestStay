import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSearchProperties } from '../../hooks/useProperties'
import PropertyCard from '../../components/shared/PropertyCard'
import type { SearchPropertiesRequest } from '../../types/property.types'

// Skeleton de card mientras carga
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

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Lee los filtros desde la query string
  const [filters, setFilters] = useState<SearchPropertiesRequest>({
    location: searchParams.get('location') ?? undefined,
    checkIn: searchParams.get('checkIn') ?? undefined,
    checkOut: searchParams.get('checkOut') ?? undefined,
    capacity: searchParams.get('capacity') ? Number(searchParams.get('capacity')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    page: 1,
    pageSize: 9,
  })

  // Estado local del formulario de filtros (draft antes de aplicar)
  const [draft, setDraft] = useState(filters)

  const { data, isLoading } = useSearchProperties(filters)

  const properties = data?.properties ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  // Aplica los filtros del draft y actualiza la URL
  const applyFilters = () => {
    const next = { ...draft, page: 1 }
    setFilters(next)
    const params = new URLSearchParams()
    if (next.location) params.set('location', next.location)
    if (next.checkIn) params.set('checkIn', next.checkIn)
    if (next.checkOut) params.set('checkOut', next.checkOut)
    if (next.capacity) params.set('capacity', String(next.capacity))
    if (next.minPrice) params.set('minPrice', String(next.minPrice))
    if (next.maxPrice) params.set('maxPrice', String(next.maxPrice))
    setSearchParams(params)
    setFiltersOpen(false)
  }

  const clearFilters = () => {
    const empty: SearchPropertiesRequest = { page: 1, pageSize: 9 }
    setDraft(empty)
    setFilters(empty)
    setSearchParams(new URLSearchParams())
  }

  const goToPage = (page: number) => setFilters((f) => ({ ...f, page }))

  // Panel de filtros reutilizable (mismo en desktop sidebar y mobile drawer)
  const FilterPanel = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Ubicación
        </label>
        <input
          type="text"
          placeholder="Ciudad, país..."
          value={draft.location ?? ''}
          onChange={(e) => setDraft({ ...draft, location: e.target.value || undefined })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Check-in
        </label>
        <input
          type="date"
          value={draft.checkIn ?? ''}
          onChange={(e) => setDraft({ ...draft, checkIn: e.target.value || undefined })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Check-out
        </label>
        <input
          type="date"
          value={draft.checkOut ?? ''}
          onChange={(e) => setDraft({ ...draft, checkOut: e.target.value || undefined })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Huéspedes
        </label>
        <input
          type="number"
          min={1}
          placeholder="Mín. personas"
          value={draft.capacity ?? ''}
          onChange={(e) =>
            setDraft({ ...draft, capacity: e.target.value ? Number(e.target.value) : undefined })
          }
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Precio mín.
          </label>
          <input
            type="number"
            min={0}
            placeholder="$0"
            value={draft.minPrice ?? ''}
            onChange={(e) =>
              setDraft({ ...draft, minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Precio máx.
          </label>
          <input
            type="number"
            min={0}
            placeholder="$∞"
            value={draft.maxPrice ?? ''}
            onChange={(e) =>
              setDraft({ ...draft, maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-[#1e3a5f] hover:bg-[#16304f] text-white font-semibold py-2 rounded-lg text-sm transition-colors"
      >
        Aplicar filtros
      </button>
      <button
        onClick={clearFilters}
        className="w-full border border-gray-300 hover:border-gray-400 text-gray-600 font-medium py-2 rounded-lg text-sm transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón filtros en móvil */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-xl font-bold text-[#1e3a5f]">Resultados</h1>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
          >
            <span>⚙️</span> Filtros
          </button>
        </div>

        {/* Drawer móvil */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setFiltersOpen(false)}
            />
            <div className="relative ml-auto w-72 bg-white h-full shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[#1e3a5f] text-lg">Filtros</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar de filtros — desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
              <h2 className="font-bold text-[#1e3a5f] text-base mb-4">Filtros</h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Columna de resultados */}
          <main className="flex-1 min-w-0">
            <div className="hidden md:flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#1e3a5f]">
                {isLoading
                  ? 'Buscando...'
                  : `${totalCount} propiedad${totalCount !== 1 ? 'es' : ''} encontrada${totalCount !== 1 ? 's' : ''}`}
              </h1>
            </div>

            {/* Grid de resultados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {isLoading
                ? Array.from({ length: 9 }).map((_, i) => <PropertyCardSkeleton key={i} />)
                : properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
            </div>

            {/* Estado vacío */}
            {!isLoading && properties.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-medium">No se encontraron propiedades</p>
                <p className="text-sm mt-1">Prueba ajustando los filtros de búsqueda</p>
              </div>
            )}

            {/* Paginación */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => goToPage((filters.page ?? 1) - 1)}
                  disabled={(filters.page ?? 1) <= 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
                >
                  ← Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      page === (filters.page ?? 1)
                        ? 'bg-[#1e3a5f] text-white'
                        : 'border border-gray-300 hover:border-[#1e3a5f] hover:text-[#1e3a5f]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage((filters.page ?? 1) + 1)}
                  disabled={(filters.page ?? 1) >= totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
