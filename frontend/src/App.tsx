import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/shared/ProtectedRoute'

import HomePage from './pages/properties/HomePage'
import SearchPage from './pages/properties/SearchPage'
import PropertyDetailPage from './pages/properties/PropertyDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ConfirmAccountPage from './pages/auth/ConfirmAccountPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import HostLayout from './components/layout/HostLayout'
import DashboardPage from './pages/host/DashboardPage'
import MyPropertiesPage from './pages/host/MyPropertiesPage'
import PropertyFormPage from './pages/host/PropertyFormPage'
import AvailabilityPage from './pages/host/AvailabilityPage'
import MyBookingsPage from './pages/guest/MyBookingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/properties/search" element={<SearchPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm-account" element={<ConfirmAccountPage />} />

        {/* Rutas protegidas — cualquier usuario autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Rutas protegidas por rol Host — con sidebar lateral */}
        <Route element={<ProtectedRoute requiredRole="Host" />}>
          <Route element={<HostLayout />}>
            <Route path="/host/dashboard" element={<DashboardPage />} />
            <Route path="/host/properties" element={<MyPropertiesPage />} />
            <Route path="/host/properties/new" element={<PropertyFormPage />} />
            <Route path="/host/properties/:id/edit" element={<PropertyFormPage />} />
            <Route path="/host/properties/:id/availability" element={<AvailabilityPage />} />
          </Route>
        </Route>

        {/* Rutas protegidas por rol Guest */}
        <Route element={<ProtectedRoute requiredRole="Guest" />}>
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Route>

        {/* Ruta 404 */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="mt-2 text-gray-500">Página no encontrada</p>
            </div>
          }
        />
      </Route>
    </Routes>
  )
}
