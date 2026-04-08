using NestStay.Application.DTOs.Bookings;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Application.Interfaces.Services;
using NestStay.Domain.Entities;
using NestStay.Domain.Enums;
using NestStay.Domain.Exceptions;

namespace NestStay.Application.Services;

public class BookingService : IBookingService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAvailabilityService _availabilityService;
    private readonly INotificationService _notificationService;

    public BookingService(
        IUnitOfWork unitOfWork,
        IAvailabilityService availabilityService,
        INotificationService notificationService)
    {
        _unitOfWork = unitOfWork;
        _availabilityService = availabilityService;
        _notificationService = notificationService;
    }

    public async Task<BookingResponse> CreateAsync(int guestId, CreateBookingRequest request)
    {
        var checkIn = request.CheckIn;
        var checkOut = request.CheckOut;
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Validar que la fecha de entrada no sea en el pasado
        if (checkIn < today)
            throw new BusinessRuleException("La fecha de entrada no puede ser en el pasado");

        // Validar que la fecha de salida sea posterior a la entrada
        if (checkOut <= checkIn)
            throw new BusinessRuleException("La fecha de salida debe ser posterior a la entrada");

        var property = await _unitOfWork.Properties.GetByIdAsync(request.PropertyId)
            ?? throw new NotFoundException("Propiedad no encontrada");

        // Validar que el huésped no sea el dueño de la propiedad
        if (property.HostId == guestId)
            throw new BusinessRuleException("No puedes reservar tu propia propiedad");

        var availability = await _availabilityService.IsAvailableAsync(request.PropertyId, checkIn, checkOut);

        if (!availability.IsAvailable)
        {
            // Formatear las fechas conflictivas para el mensaje de error
            var conflictingDates = string.Join(", ", availability.ConflictingDates.Select(d => d.ToString("yyyy-MM-dd")));
            throw new ConflictException($"Las siguientes fechas no están disponibles: {conflictingDates}");
        }

        var nights = checkOut.DayNumber - checkIn.DayNumber;
        var totalPrice = nights * property.PricePerNight;

        // Las reservas se crean confirmadas directamente, sin estado pendiente
        var booking = new Booking
        {
            PropertyId = property.Id,
            GuestId = guestId,
            CheckIn = checkIn,
            CheckOut = checkOut,
            Status = BookingStatus.Confirmed,
            TotalPrice = totalPrice,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Bookings.AddAsync(booking);
        await _unitOfWork.CommitAsync();

        // Fire-and-forget: no bloquea la creación de la reserva
        _ = _notificationService.NotifyHostNewBookingAsync(booking);

        var guest = await _unitOfWork.Users.GetByIdAsync(guestId);

        return new BookingResponse
        {
            Id = booking.Id,
            PropertyId = property.Id,
            PropertyTitle = property.Title,
            PropertyLocation = property.Location,
            GuestId = guestId,
            GuestName = guest?.Name ?? string.Empty,
            CheckIn = booking.CheckIn,
            CheckOut = booking.CheckOut,
            Status = booking.Status.ToString(),
            TotalPrice = booking.TotalPrice,
            CreatedAt = booking.CreatedAt
        };
    }
}
