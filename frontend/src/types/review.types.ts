export interface ReviewResponse {
  id: number
  bookingId: number
  propertyId: number
  guestName: string
  rating: number
  comment: string
  createdAt: string
}

export interface CreateReviewRequest {
  bookingId: number
  rating: number
  comment: string
}

export interface PropertyReviewsResponse {
  propertyId: number
  propertyTitle: string
  averageRating: number
  totalReviews: number
  reviews: ReviewResponse[]
}
