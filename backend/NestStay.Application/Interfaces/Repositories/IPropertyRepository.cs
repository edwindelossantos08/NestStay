using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Repositories;

public interface IPropertyRepository : IRepository<Property>
{
    Task<IEnumerable<Property>> GetByHostIdAsync(int hostId);

    Task<IEnumerable<Property>> SearchAvailableAsync(
        string? location,
        DateOnly? checkIn,
        DateOnly? checkOut,
        int? capacity,
        decimal? minPrice,
        decimal? maxPrice,
        int page,
        int pageSize);

    Task<int> CountSearchResultsAsync(
        string? location,
        DateOnly? checkIn,
        DateOnly? checkOut,
        int? capacity,
        decimal? minPrice,
        decimal? maxPrice);
}
