using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Repositories;

public interface IBookingRepository : IRepository<Booking>
{
    // Busca reservas Confirmed que solapen con el rango dado
    Task<IEnumerable<Booking>> GetOverlappingAsync(
        int propertyId,
        DateOnly checkIn,
        DateOnly checkOut);

    Task<IEnumerable<Booking>> GetByGuestIdAsync(int guestId);
    Task<IEnumerable<Booking>> GetByHostIdAsync(int hostId);
}
