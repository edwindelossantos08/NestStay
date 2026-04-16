import type { ReviewResponse } from './review.types'

export interface AmenityResponse {
  id: number
  name: string
  // Nombre del ícono de Lucide React
  icon: string
  category: string
}

export interface PropertyImageResponse {
  id: number
  url: string
  displayOrder: number
}

export interface PropertyResponse {
  id: number
  title: string
  description: string
  location: string
  pricePerNight: number
  capacity: number
  hostId: number
  hostName: string
  hostAvatarUrl?: string
  // URL de imagen proporcionada por el host, puede ser null
  imageUrl?: string
  // Lista de imágenes ordenadas por displayOrder
  images: PropertyImageResponse[]
  // Coordenadas para el pin en el mapa
  latitude?: number
  longitude?: number
  averageRating: number
  totalReviews: number
  createdAt: string
  latestReviews: ReviewResponse[]
  amenities: AmenityResponse[]
}

export interface CreatePropertyRequest {
  title: string
  description: string
  location: string
  pricePerNight: number
  capacity: number
  // Lista de URLs de imágenes (mínimo 1, máximo 5)
  imageUrls?: string[]
  latitude?: number
  longitude?: number
  amenityIds?: number[]
}

export interface UpdatePropertyRequest {
  title: string
  description: string
  location: string
  pricePerNight: number
  capacity: number
  // Lista de URLs de imágenes (mínimo 1, máximo 5)
  imageUrls?: string[]
  latitude?: number
  longitude?: number
  amenityIds?: number[]
}

export interface SearchPropertiesRequest {
  location?: string
  checkIn?: string
  checkOut?: string
  capacity?: number
  minPrice?: number
  maxPrice?: number
  page?: number
  pageSize?: number
}

export interface SearchPropertiesResponse {
  properties: PropertyResponse[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AvailabilityResponse {
  propertyId: number
  blockedDates: string[]
  bookedDates: string[]
  availableDates: string[]
}
