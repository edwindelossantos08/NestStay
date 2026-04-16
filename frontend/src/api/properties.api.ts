import apiClient from './axios'
import type { ApiResponse } from '../types/api.types'
import type {
  PropertyResponse,
  PropertyImageResponse,
  SearchPropertiesRequest,
  SearchPropertiesResponse,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  AvailabilityResponse,
  AmenityResponse,
} from '../types/property.types'
import type { PropertyReviewsResponse } from '../types/review.types'

export const propertiesApi = {
  search: (params: SearchPropertiesRequest) =>
    apiClient.get<ApiResponse<SearchPropertiesResponse>>(
      '/api/properties/search',
      { params }
    ),

  getById: (id: number) =>
    apiClient.get<ApiResponse<PropertyResponse>>(`/api/properties/${id}`),

  getReviews: (id: number) =>
    apiClient.get<ApiResponse<PropertyReviewsResponse>>(
      `/api/properties/${id}/reviews`
    ),

  getAvailability: (id: number, year: number, month: number) =>
    apiClient.get<ApiResponse<AvailabilityResponse>>(
      `/api/properties/${id}/availability`,
      { params: { year, month } }
    ),

  create: (data: CreatePropertyRequest) =>
    apiClient.post<ApiResponse<PropertyResponse>>('/api/properties', data),

  update: (id: number, data: UpdatePropertyRequest) =>
    apiClient.put<ApiResponse<PropertyResponse>>(
      `/api/properties/${id}`,
      data
    ),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<string>>(`/api/properties/${id}`),

  addImages: (id: number, imageUrls: string[]) =>
    apiClient.post<ApiResponse<PropertyImageResponse[]>>(
      `/api/properties/${id}/images`, { imageUrls }),

  deleteImage: (propertyId: number, imageId: number) =>
    apiClient.delete<ApiResponse<string>>(
      `/api/properties/${propertyId}/images/${imageId}`),

  reorderImages: (propertyId: number, imageIds: number[]) =>
    apiClient.put<ApiResponse<string>>(
      `/api/properties/${propertyId}/images/reorder`, { imageIds }),

  getMyProperties: () =>
    apiClient.get<ApiResponse<PropertyResponse[]>>(
      '/api/properties/my-properties'
    ),

  blockDates: (id: number, dates: string[]) =>
    apiClient.post<ApiResponse<string>>(
      `/api/properties/${id}/block-dates`,
      { dates }
    ),

  unblockDates: (id: number, dates: string[]) =>
    apiClient.delete<ApiResponse<string>>(
      `/api/properties/${id}/block-dates`,
      { data: { dates } }
    ),

  getAmenities: () =>
    apiClient.get<ApiResponse<AmenityResponse[]>>('/api/amenities'),
}
