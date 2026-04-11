using NestStay.Application.DTOs.Properties;

namespace NestStay.Application.Interfaces.Services;

public interface IAmenityService
{
    Task<IEnumerable<AmenityResponse>> GetAllAsync();
}
