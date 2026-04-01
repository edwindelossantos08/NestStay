using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Repositories;

public interface IBlockedDateRepository : IRepository<BlockedDate>
{
    Task<IEnumerable<BlockedDate>> GetByPropertyIdAsync(int propertyId);

    Task<IEnumerable<BlockedDate>> GetByPropertyAndRangeAsync(
        int propertyId,
        DateOnly checkIn,
        DateOnly checkOut);
}
