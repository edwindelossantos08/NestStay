using NestStay.Application.DTOs.Reviews;

namespace NestStay.Application.Interfaces.Services;

public interface IReviewService
{
    Task<ReviewResponse> CreateAsync(int guestId, CreateReviewRequest request);
    Task<PropertyReviewsResponse> GetByPropertyAsync(int propertyId);
}
