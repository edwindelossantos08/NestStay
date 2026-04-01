using Microsoft.EntityFrameworkCore;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Domain.Entities;
using NestStay.Infrastructure.Data;

namespace NestStay.Infrastructure.Repositories;

public class ReviewRepository : Repository<Review>, IReviewRepository
{
    public ReviewRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Review>> GetByPropertyIdAsync(int propertyId) =>
        await _dbSet
            .Include(r => r.Guest)
            .Where(r => r.PropertyId == propertyId)
            .ToListAsync();

    public async Task<Review?> GetByBookingIdAsync(int bookingId) =>
        await _dbSet.FirstOrDefaultAsync(r => r.BookingId == bookingId);

    public async Task<double> GetAverageRatingAsync(int propertyId)
    {
        var ratings = await _dbSet
            .Where(r => r.PropertyId == propertyId)
            .Select(r => (double)r.Rating)
            .ToListAsync();

        // Retorna 0 si no hay reseñas
        return ratings.Count == 0 ? 0 : ratings.Average();
    }
}
