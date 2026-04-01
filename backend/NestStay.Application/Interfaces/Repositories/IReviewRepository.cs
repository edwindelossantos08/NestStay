using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Repositories;

public interface IReviewRepository : IRepository<Review>
{
    Task<IEnumerable<Review>> GetByPropertyIdAsync(int propertyId);
    Task<Review?> GetByBookingIdAsync(int bookingId);
    Task<double> GetAverageRatingAsync(int propertyId);
}
