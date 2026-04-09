import type { ReviewResponse } from './review.types'

export interface PropertyResponse {
  id: number
  title: string
  description: string
  location: string
  pricePerNight: number
  capacity: number
  hostId: number
  hostName: string
  averageRating: number
  totalReviews: number
  createdAt: string
  latestReviews: ReviewResponse[]
}

export interface CreatePropertyRequest {
  title: string
  description: string
  location: string
  pricePerNight: number
  capacity: number
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
