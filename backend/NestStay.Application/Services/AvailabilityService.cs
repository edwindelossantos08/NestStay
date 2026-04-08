using NestStay.Application.DTOs.Availability;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Application.Interfaces.Services;
using NestStay.Domain.Entities;
using NestStay.Domain.Exceptions;

namespace NestStay.Application.Services;

public class AvailabilityService : IAvailabilityService
{
    private readonly IUnitOfWork _uow;

    public AvailabilityService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task BlockDatesAsync(int hostId, int propertyId, BlockDatesRequest request)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);
        // Si la propiedad no existe lanzamos 404
        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        // Solo el dueño puede bloquear fechas
        if (property.HostId != hostId)
            throw new UnauthorizedException();

        // Obtener las fechas ya bloqueadas para esta propiedad
        var existing = await _uow.BlockedDates.GetByPropertyIdAsync(propertyId);
        var existingDates = existing.Select(bd => bd.Date).ToHashSet();

        foreach (var date in request.Dates)
        {
            // Si ya existe la ignoramos silenciosamente
            if (existingDates.Contains(date))
                continue;

            await _uow.BlockedDates.AddAsync(new BlockedDate
            {
                PropertyId = propertyId,
                Date = date
            });
        }

        await _uow.CommitAsync();
    }

    public async Task UnblockDatesAsync(int hostId, int propertyId, UnblockDatesRequest request)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);
        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        if (property.HostId != hostId)
            throw new UnauthorizedException();

        // Cargar todas las fechas bloqueadas una sola vez para evitar N+1
        var existing = await _uow.BlockedDates.GetByPropertyIdAsync(propertyId);
        var blockedMap = existing.ToDictionary(bd => bd.Date);

        foreach (var date in request.Dates)
        {
            if (blockedMap.TryGetValue(date, out var blockedDate))
                _uow.BlockedDates.Delete(blockedDate);
        }

        await _uow.CommitAsync();
    }

    public async Task<AvailabilityResponse> GetAvailabilityAsync(int propertyId, int year, int month)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);
        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        // Rango del mes: primer día incluido, primer día del mes siguiente excluido
        var monthStart = new DateOnly(year, month, 1);
        var monthEnd = monthStart.AddMonths(1);

        var blockedEntities = await _uow.BlockedDates.GetByPropertyAndRangeAsync(
            propertyId, monthStart, monthEnd);

        var blockedDates = blockedEntities.Select(bd => bd.Date).ToList();

        // Obtener reservas Confirmed que solapan con el mes
        var bookings = await _uow.Bookings.GetOverlappingAsync(
            propertyId, monthStart, monthEnd);

        // Expandir cada reserva a sus fechas individuales dentro del mes
        var bookedDates = new HashSet<DateOnly>();
        foreach (var booking in bookings)
        {
            var current = booking.CheckIn < monthStart ? monthStart : booking.CheckIn;
            var end = booking.CheckOut > monthEnd ? monthEnd : booking.CheckOut;
            while (current < end)
            {
                bookedDates.Add(current);
                current = current.AddDays(1);
            }
        }

        var blockedSet = blockedDates.ToHashSet();

        // Fechas disponibles: todas las del mes que no están bloqueadas ni reservadas
        var availableDates = new List<DateOnly>();
        var day = monthStart;
        while (day < monthEnd)
        {
            if (!blockedSet.Contains(day) && !bookedDates.Contains(day))
                availableDates.Add(day);
            day = day.AddDays(1);
        }

        return new AvailabilityResponse
        {
            PropertyId = propertyId,
            BlockedDates = blockedDates,
            BookedDates = bookedDates.OrderBy(d => d).ToList(),
            AvailableDates = availableDates
        };
    }

    // Será reutilizada por el módulo de reservas — mantener bien separada
    public async Task<AvailabilityCheckResponse> IsAvailableAsync(
        int propertyId, DateOnly checkIn, DateOnly checkOut)
    {
        // Verificar reservas Confirmed que solapen con el rango solicitado
        var overlappingBookings = await _uow.Bookings.GetOverlappingAsync(
            propertyId, checkIn, checkOut);

        // Verificar fechas bloqueadas dentro del rango
        var blockedEntities = await _uow.BlockedDates.GetByPropertyAndRangeAsync(
            propertyId, checkIn, checkOut);

        // Construir lista de conflictos combinando ambas fuentes
        var conflicting = new HashSet<DateOnly>();

        foreach (var booking in overlappingBookings)
        {
            var current = booking.CheckIn < checkIn ? checkIn : booking.CheckIn;
            var end = booking.CheckOut > checkOut ? checkOut : booking.CheckOut;
            while (current < end)
            {
                conflicting.Add(current);
                current = current.AddDays(1);
            }
        }

        foreach (var bd in blockedEntities)
            conflicting.Add(bd.Date);

        return new AvailabilityCheckResponse
        {
            IsAvailable = conflicting.Count == 0,
            ConflictingDates = conflicting.OrderBy(d => d).ToList()
        };
    }
}
