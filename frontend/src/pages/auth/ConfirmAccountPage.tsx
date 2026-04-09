import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'
import { useConfirmAccount } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function ConfirmAccountPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  // Si no hay token en la URL, redirigir al inicio
  useEffect(() => {
    if (!token) navigate('/', { replace: true })
  }, [token, navigate])

  const { isLoading, isSuccess, isError } = useConfirmAccount(token)

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 bg-gray-50">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500">Verificando tu cuenta...</p>
      </div>
    )
  }

  // Pantalla de éxito
  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4">
        <Card padding="lg" className="w-full max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Cuenta confirmada!</h2>
          <p className="mt-3 text-gray-600">
            Tu cuenta ha sido verificada exitosamente.
            <br />
            Ya puedes iniciar sesión.
          </p>
          <div className="mt-8">
            <Link to="/login">
              <Button variant="primary" size="lg" className="w-full">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  // Pantalla de error (token inválido o expirado)
  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4">
        <Card padding="lg" className="w-full max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Enlace inválido</h2>
          <p className="mt-3 text-gray-600">
            El enlace expiró o ya fue utilizado anteriormente.
          </p>
          <div className="mt-8">
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return null
}
