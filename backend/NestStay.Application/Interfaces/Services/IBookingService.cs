using NestStay.Application.DTOs.Bookings;

namespace NestStay.Application.Interfaces.Services;

public interface IBookingService
{
    Task<BookingResponse> CreateAsync(int guestId, CreateBookingRequest request);
}
