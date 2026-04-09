import apiClient from './axios'
import type { PropertyResponse, CreatePropertyRequest, SearchPropertiesRequest, SearchPropertiesResponse } from '../types/property.types'
import type { ApiResponse } from '../types/api.types'

export const propertiesApi = {
  search: (params: SearchPropertiesRequest) =>
    apiClient.get<ApiResponse<SearchPropertiesResponse>>('/api/properties/search', { params }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<PropertyResponse>>(`/api/properties/${id}`),

  getMyProperties: () =>
    apiClient.get<ApiResponse<PropertyResponse[]>>('/api/properties/my-properties'),

  create: (data: CreatePropertyRequest) =>
    apiClient.post<ApiResponse<PropertyResponse>>('/api/properties', data),

  update: (id: number, data: CreatePropertyRequest) =>
    apiClient.put<ApiResponse<PropertyResponse>>(`/api/properties/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/properties/${id}`),
}
