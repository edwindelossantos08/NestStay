import apiClient from './axios'
import type { ApiResponse } from '../types/api.types'
import type {
  PropertyResponse,
  SearchPropertiesRequest,
  SearchPropertiesResponse,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  AvailabilityResponse,
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
}
