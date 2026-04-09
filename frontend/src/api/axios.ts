import axios from 'axios'

// Instancia base de axios configurada con la URL del backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Adjunta el token JWT a cada request si existe en localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('neststay_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el error es 401, limpiar sesión y redirigir al login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('neststay_token')
      localStorage.removeItem('neststay_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
