import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProtectedRoute from '../components/shared/ProtectedRoute'

import HomePage from '../pages/properties/HomePage'
import SearchPage from '../pages/properties/SearchPage'
import PropertyDetailPage from '../pages/properties/PropertyDetailPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ConfirmAccountPage from '../pages/auth/ConfirmAccountPage'
import NotificationsPage from '../pages/notifications/NotificationsPage'
import DashboardPage from '../pages/host/DashboardPage'
import MyPropertiesPage from '../pages/host/MyPropertiesPage'
import PropertyFormPage from '../pages/host/PropertyFormPage'
import AvailabilityPage from '../pages/host/AvailabilityPage'
import MyBookingsPage from '../pages/guest/MyBookingsPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Rutas públicas
      { path: '/', element: <HomePage /> },
      { path: '/properties/search', element: <SearchPage /> },
      { path: '/properties/:id', element: <PropertyDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/confirm-account', element: <ConfirmAccountPage /> },

      // Rutas protegidas — cualquier usuario autenticado
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/notifications', element: <NotificationsPage /> },
        ],
      },

      // Rutas protegidas por rol Host
      {
        element: <ProtectedRoute requiredRole="Host" />,
        children: [
          { path: '/host/dashboard', element: <DashboardPage /> },
          { path: '/host/properties', element: <MyPropertiesPage /> },
          { path: '/host/properties/new', element: <PropertyFormPage /> },
          { path: '/host/properties/:id/edit', element: <PropertyFormPage /> },
          { path: '/host/properties/:id/availability', element: <AvailabilityPage /> },
        ],
      },

      // Rutas protegidas por rol Guest
      {
        element: <ProtectedRoute requiredRole="Guest" />,
        children: [
          { path: '/my-bookings', element: <MyBookingsPage /> },
        ],
      },

      // Ruta 404
      {
        path: '*',
        element: (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <p className="mt-2 text-gray-500">Página no encontrada</p>
          </div>
        ),
      },
    ],
  },
])

export default router
