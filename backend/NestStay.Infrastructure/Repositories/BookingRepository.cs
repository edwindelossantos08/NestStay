using Microsoft.EntityFrameworkCore;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Domain.Entities;
using NestStay.Domain.Enums;
using NestStay.Infrastructure.Data;

namespace NestStay.Infrastructure.Repositories;

public class BookingRepository : Repository<Booking>, IBookingRepository
{
    public BookingRepository(ApplicationDbContext context) : base(context) { }

    // Solo considera reservas Confirmed para el solapamiento
    public async Task<IEnumerable<Booking>> GetOverlappingAsync(
        int propertyId,
        DateOnly checkIn,
        DateOnly checkOut)
    {
        return await _dbSet
            .Where(b =>
                b.PropertyId == propertyId &&
                b.Status == BookingStatus.Confirmed &&
                b.CheckIn < checkOut &&
                b.CheckOut > checkIn)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetByGuestIdAsync(int guestId) =>
        await _dbSet
            .Include(b => b.Property)
            .Where(b => b.GuestId == guestId)
            .ToListAsync();

    public async Task<IEnumerable<Booking>> GetByHostIdAsync(int hostId) =>
        await _dbSet
            .Include(b => b.Property)
            .Include(b => b.Guest)
            .Where(b => b.Property.HostId == hostId)
            .ToListAsync();
}
