import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { useAuth as useAuthContext } from '../context/AuthContext'

// Re-exporta useAuth desde el contexto para uso conveniente
export { useAuth } from '../context/AuthContext'

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  })
}

export const useLogin = () => {
  const { login } = useAuthContext()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      // Guardar en contexto si el login fue exitoso
      if (response.data.success) {
        login(response.data.data)
      }
    },
  })
}

export const useConfirmAccount = (token: string) => {
  return useQuery({
    queryKey: ['confirm-account', token],
    queryFn: () => authApi.confirmAccount(token),
    enabled: !!token,
    retry: false,
  })
}
