import apiClient from './axios'
import type { ReviewResponse, CreateReviewRequest, PropertyReviewsResponse } from '../types/review.types'
import type { ApiResponse } from '../types/api.types'

export const reviewsApi = {
  create: (data: CreateReviewRequest) =>
    apiClient.post<ApiResponse<ReviewResponse>>('/api/reviews', data),

  getByProperty: (propertyId: number) =>
    apiClient.get<ApiResponse<PropertyReviewsResponse>>(`/api/reviews/property/${propertyId}`),
}
