using Microsoft.EntityFrameworkCore;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Domain.Entities;
using NestStay.Infrastructure.Data;

namespace NestStay.Infrastructure.Repositories;

public class BlockedDateRepository : Repository<BlockedDate>, IBlockedDateRepository
{
    public BlockedDateRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<BlockedDate>> GetByPropertyIdAsync(int propertyId) =>
        await _dbSet.Where(bd => bd.PropertyId == propertyId).ToListAsync();

    public async Task<IEnumerable<BlockedDate>> GetByPropertyAndRangeAsync(
        int propertyId,
        DateOnly checkIn,
        DateOnly checkOut)
    {
        return await _dbSet
            .Where(bd =>
                bd.PropertyId == propertyId &&
                bd.Date >= checkIn &&
                bd.Date < checkOut)
            .ToListAsync();
    }
}
