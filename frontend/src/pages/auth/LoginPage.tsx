import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react'
import { useLogin } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

const schema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [backendError, setBackendError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { mutate: login, isPending } = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    setBackendError(null)
    login(data, {
      onSuccess: (response) => {
        if (response.data.success) {
          const roles = response.data.data.roles
          // Redirige según rol: Host tiene prioridad sobre Guest
          if (roles.includes('Host')) {
            navigate('/host/dashboard')
          } else {
            navigate('/properties/search')
          }
        } else {
          setBackendError(response.data.message || 'Ocurrió un error inesperado')
        }
      },
      onError: (error: unknown) => {
        // Muestra el mensaje exacto del backend
        const axiosError = error as { response?: { data?: { message?: string } } }
        setBackendError(
          axiosError.response?.data?.message ?? 'Error al conectar con el servidor'
        )
      },
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold text-coral">
            <Home className="h-8 w-8" /> NestStay
          </Link>
          <p className="mt-2 text-gray-500">Bienvenido de nuevo</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="juan@ejemplo.com"
              leftIcon={<Mail className="h-4 w-4" />}
              register={register('email')}
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
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  className={`h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:ring-2 ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-navy focus:ring-navy/20'
                  }`}
                  {...register('password')}
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
              {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-coral hover:text-coral-dark">
              Regístrate aquí
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
