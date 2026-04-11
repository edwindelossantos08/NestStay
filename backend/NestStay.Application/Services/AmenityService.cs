using NestStay.Application.DTOs.Properties;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Application.Interfaces.Services;

namespace NestStay.Application.Services;

public class AmenityService : IAmenityService
{
    private readonly IUnitOfWork _uow;

    public AmenityService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<AmenityResponse>> GetAllAsync()
    {
        var amenities = await _uow.Amenities.GetAllAsync();
        
        return amenities
            .Select(a => new AmenityResponse
            {
                Id = a.Id,
                Name = a.Name,
                Icon = a.Icon,
                Category = a.Category
            })
            .OrderBy(a => a.Category);
    }
}
