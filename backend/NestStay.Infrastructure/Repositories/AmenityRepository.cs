using Microsoft.EntityFrameworkCore;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Domain.Entities;
using NestStay.Infrastructure.Data;

namespace NestStay.Infrastructure.Repositories;

public class AmenityRepository : Repository<Amenity>, IAmenityRepository
{
    public AmenityRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Amenity>> GetByIdsAsync(IEnumerable<int> ids)
    {
        return await _context.Amenities
            .Where(a => ids.Contains(a.Id))
            .ToListAsync();
    }
}
