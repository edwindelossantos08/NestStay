import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, MapPin, Star, Users } from 'lucide-react'
import { useMyProperties, useDeleteProperty } from '../../hooks/useProperties'
import { useToast } from '../../context/ToastContext'
import PropertyImage from '../../components/shared/PropertyImage'
import Modal from '../../components/ui/Modal'
import type { PropertyResponse } from '../../types/property.types'

export default function MyPropertiesPage() {
  const { data: properties = [], isLoading } = useMyProperties()
  const { mutate: deleteProperty, isPending: deleting } = useDeleteProperty()
  const toast = useToast()

  const [toDelete, setToDelete] = useState<PropertyResponse | null>(null)

  const handleDeleteConfirm = () => {
    if (!toDelete) return
    deleteProperty(toDelete.id, {
      onSuccess: () => {
        toast.success('Propiedad eliminada', `"${toDelete.title}" fue eliminada correctamente.`)
        setToDelete(null)
      },
      onError: () => {
        toast.error('Error al eliminar', 'No se pudo eliminar la propiedad. Intenta de nuevo.')
        setToDelete(null)
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Mis propiedades</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona tus alojamientos
          </p>
        </div>
        <Link
          to="/host/properties/new"
          className="bg-coral hover:bg-coral-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + Nueva propiedad
        </Link>
      </div>

      {/* Skeleton de carga */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-64" />
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {!isLoading && properties.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-sm">
          <Home className="h-16 w-16 mx-auto text-gray-200 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">
            Aún no tienes propiedades
          </h2>
          <p className="text-sm text-gray-400 mt-1 mb-5">
            Crea tu primera propiedad y empieza a recibir huéspedes.
          </p>
          <Link
            to="/host/properties/new"
            className="bg-coral text-white text-sm px-5 py-2.5 rounded-xl hover:bg-coral-dark transition-colors"
          >
            + Crear propiedad
          </Link>
        </div>
      )}

      {/* Grid de propiedades */}
      {!isLoading && properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              {/* Imagen */}
              <div className="h-44 overflow-hidden">
                <PropertyImage
                  imageUrl={property.imageUrl}
                  title={property.title}
                  id={property.id}
                  variant="card"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1">
                    {property.title}
                  </h3>
                  {property.averageRating > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-coral font-bold shrink-0">
                      <Star className="h-3 w-3" /> {property.averageRating.toFixed(1)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {property.location}</p>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    ${property.pricePerNight.toLocaleString('es-DO')}/noche
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {property.capacity} personas
                  </span>
                </div>

                {/* Acciones */}
                <div className="mt-auto pt-3 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/host/properties/${property.id}/edit`}
                      className="flex-1 text-center text-xs bg-coral text-white px-2 py-2 rounded-lg hover:bg-coral-dark transition-colors font-medium"
                    >
                      Editar
                    </Link>
                    <Link
                      to={`/host/properties/${property.id}/availability`}
                      className="flex-1 text-center text-xs border border-coral text-coral px-2 py-2 rounded-lg hover:bg-coral/5 transition-colors font-medium"
                    >
                      Disponibilidad
                    </Link>
                  </div>
                  <button
                    onClick={() => setToDelete(property)}
                    className="w-full text-xs text-red-500 border border-red-200 px-2 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Eliminar propiedad"
      >
        <p className="text-sm text-gray-600">
          ¿Estás seguro que deseas eliminar{' '}
          <strong className="text-gray-800">"{toDelete?.title}"</strong>? Esta
          acción no se puede deshacer.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setToDelete(null)}
            className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteConfirm}
            disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {deleting ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
