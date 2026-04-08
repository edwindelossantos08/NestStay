using NestStay.Application.DTOs.Bookings;

namespace NestStay.Application.Interfaces.Services;

public interface IBookingService
{
    Task<BookingResponse> CreateAsync(int guestId, CreateBookingRequest request);
    Task<CancelBookingResponse> CancelAsync(int userId, int bookingId);
    Task<CompleteBookingResponse> CompleteAsync(int userId, int bookingId);
    Task<IEnumerable<BookingResponse>> GetByGuestAsync(int guestId);
    Task<IEnumerable<BookingResponse>> GetByHostAsync(int hostId);
}
