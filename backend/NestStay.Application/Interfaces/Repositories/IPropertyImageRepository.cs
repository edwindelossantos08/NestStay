using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Repositories;

public interface IPropertyImageRepository : IRepository<PropertyImage>
{
    Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(int propertyId);
    Task DeleteByPropertyIdAsync(int propertyId);
}
