import { useState, useEffect } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  usePropertyById,
  useCreateProperty,
  useUpdateProperty,
  useAmenities,
} from '../../hooks/useProperties'
import { useToast } from '../../context/ToastContext'
import AmenityIcon from '../../components/shared/AmenityIcon'
import { cn } from '../../utils/cn'
import type { AmenityResponse } from '../../types/property.types'

const schema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres'),
  location: z.string().min(3, 'La ubicación es requerida'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  pricePerNight: z
    .number({ error: 'Ingresa un precio válido' })
    .min(1, 'El precio debe ser mayor a 0')
    .max(10000, 'El precio no puede superar $10,000'),
  capacity: z
    .number({ error: 'Ingresa una capacidad válida' })
    .min(1, 'La capacidad mínima es 1')
    .max(50, 'La capacidad no puede superar 50'),
})

type FormValues = z.infer<typeof schema>

export default function PropertyFormPage() {
  const { id } = useParams<{ id: string }>()
  const propertyId = id ? Number(id) : undefined
  const isEdit = !!propertyId

  const navigate = useNavigate()
  const toast = useToast()

  const { data: property } = usePropertyById(propertyId ?? 0)
  const { mutate: createProperty, isPending: creating } = useCreateProperty()
  const { mutate: updateProperty, isPending: updating } = useUpdateProperty(
    propertyId ?? 0
  )
  const { data: amenities } = useAmenities()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      latitude: undefined,
      longitude: undefined,
      pricePerNight: undefined,
      capacity: undefined,
    },
  })

  const [imageUrls, setImageUrls] = useState<string[]>([''])
  // En modo edición pre-selecciona las amenidades actuales
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([])

  const toggleAmenity = (amenityId: number) => {
    setSelectedAmenityIds(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    )
  }

  // Pre-rellena el formulario en modo edición
  useEffect(() => {
    if (property && isEdit) {
      setValue('title', property.title)
      setValue('description', property.description)
      setValue('location', property.location)
      if (property.latitude) setValue('latitude', property.latitude)
      if (property.longitude) setValue('longitude', property.longitude)
      setValue('pricePerNight', property.pricePerNight)
      setValue('capacity', property.capacity)
      
      if (property.images && property.images.length > 0) {
        setImageUrls(property.images.map(i => i.url))
      } else if (property.imageUrl) {
        setImageUrls([property.imageUrl])
      }

      if (property.amenities && property.amenities.length > 0) {
        setSelectedAmenityIds(property.amenities.map(a => a.id))
      }
    }
  }, [property, isEdit, setValue])

  const addImageUrl = () => {
    if (imageUrls.length < 5) {
      setImageUrls(prev => [...prev, ''])
    }
  }

  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const updateImageUrl = (index: number, value: string) => {
    setImageUrls(prev => prev.map((url, i) => i === index ? value : url))
  }

  const watchedLat = watch('latitude')
  const watchedLng = watch('longitude')

  const geocodeLocation = async (location: string) => {
    if (!location) return
    try {
      const query = `${location}, República Dominicana`
      const url = `https://nominatim.openstreetmap.org/search?q=${
        encodeURIComponent(query)}&format=json&limit=1`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'NestStay/1.0 (proyecto universitario)'
        }
      })
      const data = await response.json()

      if (data.length > 0) {
        setValue('latitude', parseFloat(data[0].lat))
        setValue('longitude', parseFloat(data[0].lon))
        toast.success(`📍 Ubicación encontrada: ${data[0].display_name}`)
      }
    } catch {
      // Si falla el geocoding simplemente no se guardan coordenadas
    }
  }

  const onSubmit = (data: FormValues) => {
    const validUrls = imageUrls.filter(url => url.trim().length > 0)
    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      pricePerNight: data.pricePerNight,
      capacity: data.capacity,
      imageUrls: validUrls.length > 0 ? validUrls : undefined,
      amenityIds: selectedAmenityIds,
    }

    if (isEdit) {
      updateProperty(payload, {
        onSuccess: () => {
          toast.success('Propiedad actualizada', 'Los cambios se guardaron correctamente.')
          navigate('/host/properties')
        },
        onError: () => {
          toast.error('Error al actualizar', 'No se pudo guardar los cambios. Intenta de nuevo.')
        },
      })
    } else {
      createProperty(payload, {
        onSuccess: () => {
          toast.success('Propiedad creada', 'Tu nueva propiedad fue publicada correctamente.')
          navigate('/host/properties')
        },
        onError: () => {
          toast.error('Error al crear', 'No se pudo crear la propiedad. Intenta de nuevo.')
        },
      })
    }
  }

  const isPending = creating || updating

  return (
    <div className="max-w-2xl mx-auto">
      {/* Encabezado con botón volver */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/host/properties"
          className="text-sm text-[#1e3a5f] hover:underline"
        >
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">
          {isEdit ? 'Editar propiedad' : 'Crear propiedad'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5"
      >
        <input type="hidden" {...register('latitude', { valueAsNumber: true })} />
        <input type="hidden" {...register('longitude', { valueAsNumber: true })} />

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de la propiedad
          </label>
          <input
            {...register('title')}
            placeholder="Ej: Casa en la playa con vista al mar"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Describe tu propiedad en detalle..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 resize-none"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            {...register('location', {
              onBlur: (e) => geocodeLocation(e.target.value)
            })}
            placeholder="Ej: Santo Domingo, República Dominicana"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
          {errors.location && (
            <p className="text-xs text-red-500 mt-1">
              {errors.location.message}
            </p>
          )}
          {watchedLat && watchedLng && (
            <p className="text-xs text-green-600 mt-1">
              ✅ Ubicación confirmada en el mapa
            </p>
          )}
        </div>

        {/* Imágenes de la propiedad */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Imágenes de la propiedad (máx. 5)
            </label>
            <p className="text-xs text-gray-400">
              💡 Busca fotos en <a href="https://unsplash.com/s/photos/house" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">unsplash.com</a> y pega su URL. La primera imagen será la foto principal.
            </p>
          </div>

          {imageUrls.map((url, index) => (
            <div key={index} className="flex flex-col gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2">
                <input
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              {/* Preview si URL parece válida */}
              {url.startsWith('http') && (
                <div className="h-32 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    onLoad={(e) => { e.currentTarget.style.display = 'block' }}
                  />
                </div>
              )}
            </div>
          ))}

          {imageUrls.length < 5 && (
            <button
              type="button"
              onClick={addImageUrl}
              className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <Plus size={16} />
              Agregar otra imagen
            </button>
          )}
        </div>

        {/* Precio y capacidad en la misma fila */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio por noche ($)
            </label>
            <input
              type="number"
              min={1}
              {...register('pricePerNight', { valueAsNumber: true })}
              placeholder="120"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            />
            {errors.pricePerNight && (
              <p className="text-xs text-red-500 mt-1">
                {errors.pricePerNight.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad 👥
            </label>
            <input
              type="number"
              min={1}
              max={50}
              {...register('capacity', { valueAsNumber: true })}
              placeholder="4"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            />
            {errors.capacity && (
              <p className="text-xs text-red-500 mt-1">
                {errors.capacity.message}
              </p>
            )}
          </div>
        </div>

        {/* Selector de amenidades */}
        {amenities && amenities.length > 0 && (() => {
          const amenitiesByCategory = amenities.reduce(
            (groups, amenity) => {
              if (!groups[amenity.category]) groups[amenity.category] = []
              groups[amenity.category].push(amenity)
              return groups
            },
            {} as Record<string, AmenityResponse[]>
          )

          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Comodidades
              </label>
              {Object.entries(amenitiesByCategory).map(([category, items]) => (
                <div key={category} className="mb-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    {category}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {items.map(amenity => {
                      const isSelected = selectedAmenityIds.includes(amenity.id)
                      return (
                        <button
                          key={amenity.id}
                          type="button"
                          onClick={() => toggleAmenity(amenity.id)}
                          className={cn(
                            'flex items-center gap-2 p-3 rounded-xl border text-sm transition-all duration-150',
                            isSelected
                              ? 'border-gray-900 bg-gray-50 font-medium'
                              : 'border-gray-200 hover:border-gray-400'
                          )}
                        >
                          <AmenityIcon iconName={amenity.icon} size={16} />
                          {amenity.name}
                          {isSelected && <Check size={14} className="ml-auto" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        })()}

        {/* Botón submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#1e3a5f] hover:bg-[#163152] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mt-1"
        >
          {isPending
            ? isEdit
              ? 'Guardando...'
              : 'Creando...'
            : 'Guardar propiedad'}
        </button>
      </form>
    </div>
  )
}
