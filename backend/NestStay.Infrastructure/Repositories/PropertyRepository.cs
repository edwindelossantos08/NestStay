using Microsoft.EntityFrameworkCore;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Domain.Entities;
using NestStay.Domain.Enums;
using NestStay.Infrastructure.Data;

namespace NestStay.Infrastructure.Repositories;

public class PropertyRepository : Repository<Property>, IPropertyRepository
{
    public PropertyRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Property>> GetByHostIdAsync(int hostId) =>
        await _dbSet.Where(p => p.HostId == hostId).ToListAsync();

    // Construye la query con filtros opcionales para reutilizar en búsqueda y conteo
    private IQueryable<Property> BuildSearchQuery(
        string? location,
        DateOnly? checkIn,
        DateOnly? checkOut,
        int? capacity,
        decimal? minPrice,
        decimal? maxPrice)
    {
        IQueryable<Property> query = _dbSet;

        // Aplica filtros opcionales uno por uno
        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(p => p.Location.Contains(location));

        if (capacity.HasValue)
            query = query.Where(p => p.Capacity >= capacity.Value);

        if (minPrice.HasValue)
            query = query.Where(p => p.PricePerNight >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.PricePerNight <= maxPrice.Value);

        if (checkIn.HasValue && checkOut.HasValue)
        {
            DateOnly ci = checkIn.Value;
            DateOnly co = checkOut.Value;

            // Excluye propiedades con reservas Confirmed que solapen el rango
            query = query.Where(p => !p.Bookings.Any(b =>
                b.Status == BookingStatus.Confirmed &&
                b.CheckIn < co &&
                b.CheckOut > ci));

            // Excluye propiedades con fechas bloqueadas dentro del rango
            query = query.Where(p => !p.BlockedDates.Any(bd =>
                bd.Date >= ci && bd.Date < co));
        }

        return query;
    }

    public async Task<IEnumerable<Property>> SearchAvailableAsync(
        string? location,
        DateOnly? checkIn,
        DateOnly? checkOut,
        int? capacity,
        decimal? minPrice,
        decimal? maxPrice,
        int page,
        int pageSize)
    {
        return await BuildSearchQuery(location, checkIn, checkOut, capacity, minPrice, maxPrice)
            .Include(p => p.Host)
            .Include(p => p.Reviews)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountSearchResultsAsync(
        string? location,
        DateOnly? checkIn,
        DateOnly? checkOut,
        int? capacity,
        decimal? minPrice,
        decimal? maxPrice)
    {
        return await BuildSearchQuery(location, checkIn, checkOut, capacity, minPrice, maxPrice)
            .CountAsync();
    }
}
