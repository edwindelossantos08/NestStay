import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { authApi } from '../../api/auth.api'
import type { UserProfileResponse } from '../../types/auth.types'
import UserAvatar from '../../components/shared/UserAvatar'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { formatDate } from '../../utils/formatters'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  avatarUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

export default function ProfilePage() {
  const { updateUser } = useAuth()
  const toast = useToast()

  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      avatarUrl: '',
    },
  })

  const previewUrl = watch('avatarUrl')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authApi.getProfile()
        if (response.data.success) {
          setProfile(response.data.data)
          reset({
            name: response.data.data.name,
            avatarUrl: response.data.data.avatarUrl || '',
          })
        } else {
          toast.error('Error', response.data.message || 'No se pudo cargar el perfil')
        }
      } catch (error) {
        toast.error('Error', 'No se pudo cargar el perfil')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [reset, toast])

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)
    try {
      const response = await authApi.updateProfile({
        name: data.name,
        avatarUrl: data.avatarUrl || undefined,
      })
      if (response.data.success) {
        setProfile(response.data.data)
        updateUser({
          userName: response.data.data.name,
          avatarUrl: response.data.data.avatarUrl,
        })
        toast.success('Perfil actualizado', 'Tus cambios han sido guardados.')
      } else {
        toast.error('Error', response.data.message || 'No se pudo actualizar el perfil')
      }
    } catch (error) {
      toast.error('Error', 'Hubo un problema al guardar los cambios.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse bg-gray-200 h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">
        No se pudo cargar la información del perfil.
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi perfil</h1>

      {/* Header del perfil */}
      <Card className="mb-8 p-8 flex flex-col items-center text-center">
        <UserAvatar
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          size="xl"
          className="mb-4 shadow-lg border-4 border-white"
        />
        <h2 className="text-2xl font-semibold text-gray-900">{profile.name}</h2>
        <p className="text-gray-500 mb-2">{profile.email}</p>
        <p className="text-sm text-gray-400">
          Miembro desde {formatDate(profile.createdAt)}
        </p>
      </Card>

      {/* Formulario de edición */}
      <Card className="p-6 md:p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">
          Editar perfil
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Nombre"
            placeholder="Tu nombre completo"
            register={register('name')}
            error={errors.name?.message}
          />

          <div className="space-y-4">
            <Input
              label="URL de avatar (opcional)"
              placeholder="https://ejemplo.com/avatar.jpg"
              register={register('avatarUrl')}
              error={errors.avatarUrl?.message}
            />

            {previewUrl && !errors.avatarUrl && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Preview:</span>
                <UserAvatar name={watch('name') || profile.name} avatarUrl={previewUrl} size="lg" />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
