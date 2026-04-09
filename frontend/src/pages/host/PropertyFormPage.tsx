import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  usePropertyById,
  useCreateProperty,
  useUpdateProperty,
} from '../../hooks/useProperties'
import { useToast } from '../../context/ToastContext'

const schema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres'),
  location: z.string().min(3, 'La ubicación es requerida'),
  pricePerNight: z
    .number({ error: 'Ingresa un precio válido' })
    .min(1, 'El precio debe ser mayor a 0')
    .max(10000, 'El precio no puede superar $10,000'),
  capacity: z
    .number({ error: 'Ingresa una capacidad válida' })
    .min(1, 'La capacidad mínima es 1')
    .max(50, 'La capacidad no puede superar 50'),
  imageUrl: z
    .string()
    .refine((val) => !val || val.startsWith('http'), {
      message: 'Debe ser una URL de imagen válida',
    })
    .optional()
    .or(z.literal('')),
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
      pricePerNight: undefined,
      capacity: undefined,
      imageUrl: '',
    },
  })

  // Pre-rellena el formulario en modo edición
  useEffect(() => {
    if (property && isEdit) {
      setValue('title', property.title)
      setValue('description', property.description)
      setValue('location', property.location)
      setValue('pricePerNight', property.pricePerNight)
      setValue('capacity', property.capacity)
      // Pre-rellena la imagen existente si la tiene
      setValue('imageUrl', property.imageUrl || '')
    }
  }, [property, isEdit, setValue])

  // Observa el campo imageUrl para el preview en tiempo real
  const watchedImageUrl = watch('imageUrl')

  const onSubmit = (data: FormValues) => {
    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      pricePerNight: data.pricePerNight,
      capacity: data.capacity,
      imageUrl: data.imageUrl || undefined,
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
            {...register('location')}
            placeholder="Ej: Santo Domingo, República Dominicana"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
          {errors.location && (
            <p className="text-xs text-red-500 mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* URL de imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de imagen{' '}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            {...register('imageUrl')}
            placeholder="https://images.unsplash.com/..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
          {errors.imageUrl && (
            <p className="text-xs text-red-500 mt-1">
              {errors.imageUrl.message}
            </p>
          )}

          {/* Preview en tiempo real si la URL es válida */}
          {watchedImageUrl && watchedImageUrl.startsWith('http') && (
            <div className="mt-2 rounded-xl overflow-hidden h-40 bg-gray-100 border border-gray-200">
              <img
                src={watchedImageUrl}
                alt="Preview de imagen"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Si la URL falla oculta el preview silenciosamente
                  e.currentTarget.style.display = 'none'
                }}
                onLoad={(e) => {
                  // Muestra el preview cuando carga correctamente
                  e.currentTarget.style.display = 'block'
                }}
              />
            </div>
          )}

          <p className="text-xs text-gray-400 mt-1">
            Pega la URL de cualquier imagen. Sugerencia:{' '}
            <a
              href="https://unsplash.com/s/photos/house"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              busca en Unsplash
            </a>
            , abre una foto y copia la URL.
          </p>
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
