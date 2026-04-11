using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Repositories;

public interface IAmenityRepository : IRepository<Amenity>
{
    Task<IEnumerable<Amenity>> GetByIdsAsync(IEnumerable<int> ids);
}
