import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useRegister } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)
  const [backendError, setBackendError] = useState<string | null>(null)

  const { mutate: register, isPending } = useRegister()

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    setBackendError(null)
    register(data, {
      onSuccess: (response) => {
        if (response.data.success) {
          setRegisteredEmail(data.email)
        } else {
          setBackendError(response.data.message || 'Ocurrió un error inesperado')
        }
      },
      onError: (error: unknown) => {
        // Extrae el mensaje de error del backend si está disponible
        const axiosError = error as { response?: { data?: { message?: string } } }
        setBackendError(
          axiosError.response?.data?.message ?? 'Error al conectar con el servidor'
        )
      },
    })
  }

  // Pantalla de éxito tras el registro
  if (registeredEmail) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
        <Card padding="lg" className="w-full max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Mail className="h-8 w-8 text-navy" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Revisa tu correo</h2>
          <p className="mt-3 text-gray-600">
            Te enviamos un enlace de confirmación a:
          </p>
          <p className="mt-1 font-semibold text-navy">{registeredEmail}</p>
          <p className="mt-3 text-sm text-gray-500">
            Haz clic en el enlace del correo para activar tu cuenta antes de iniciar sesión.
          </p>
          <div className="mt-8">
            <Link to="/">
              <Button variant="outline" className="w-full">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold text-navy">
            🏠 NestStay
          </Link>
          <p className="mt-2 text-gray-500">Crea tu cuenta gratis</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Nombre completo"
              placeholder="Juan García"
              leftIcon={<User className="h-4 w-4" />}
              register={formRegister('name')}
              error={errors.name?.message}
              autoComplete="name"
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="juan@ejemplo.com"
              leftIcon={<Mail className="h-4 w-4" />}
              register={formRegister('email')}
              error={errors.email?.message}
              autoComplete="email"
            />

            {/* Campo contraseña con toggle de visibilidad */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className={`h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:ring-2 ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-navy focus:ring-navy/20'
                  }`}
                  {...formRegister('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {/* Campo confirmar contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  className={`h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-navy focus:ring-navy/20'
                  }`}
                  {...formRegister('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Error del backend */}
            {backendError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{backendError}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isPending}
              className="w-full"
            >
              {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-navy hover:text-gold">
              Inicia sesión aquí
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
