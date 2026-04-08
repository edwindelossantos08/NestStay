using NestStay.Application.DTOs.Availability;

namespace NestStay.Application.Interfaces.Services;

public interface IAvailabilityService
{
    Task BlockDatesAsync(int hostId, int propertyId, BlockDatesRequest request);
    Task UnblockDatesAsync(int hostId, int propertyId, UnblockDatesRequest request);
    Task<AvailabilityResponse> GetAvailabilityAsync(int propertyId, int year, int month);
    // Será reutilizada por el módulo de reservas en la siguiente fase
    Task<AvailabilityCheckResponse> IsAvailableAsync(int propertyId, DateOnly checkIn, DateOnly checkOut);
}
