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

    public async Task<CancelBookingResponse> CancelAsync(int userId, int bookingId)
    {
        var booking = await _unitOfWork.Bookings.GetByIdAsync(bookingId)
            ?? throw new NotFoundException("Reserva no encontrada");

        // Obtener la propiedad para verificar si el usuario es el host
        var property = await _unitOfWork.Properties.GetByIdAsync(booking.PropertyId)
            ?? throw new NotFoundException("Propiedad no encontrada");

        // La cancelación la puede hacer el guest O el host de la propiedad
        if (userId != booking.GuestId && userId != property.HostId)
            throw new UnauthorizedException("No tienes permiso para cancelar esta reserva");

        if (booking.Status == BookingStatus.Cancelled)
            throw new BusinessRuleException("La reserva ya está cancelada");

        if (booking.Status == BookingStatus.Completed)
            throw new BusinessRuleException("No se puede cancelar una reserva completada");

        booking.Status = BookingStatus.Cancelled;

        // Las fechas quedan libres automáticamente ya que la validación
        // de disponibilidad solo considera reservas Confirmed
        await _unitOfWork.CommitAsync();

        _ = _notificationService.NotifyBookingCancelledAsync(booking);

        return new CancelBookingResponse
        {
            BookingId = booking.Id,
            Message = "Reserva cancelada exitosamente",
            Status = booking.Status.ToString()
        };
    }

    public async Task<CompleteBookingResponse> CompleteAsync(int userId, int bookingId)
    {
        var booking = await _unitOfWork.Bookings.GetByIdAsync(bookingId)
            ?? throw new NotFoundException("Reserva no encontrada");

        // Solo el guest puede marcar como completada
        if (userId != booking.GuestId)
            throw new UnauthorizedException("Solo el huésped puede completar la reserva");

        if (booking.Status == BookingStatus.Cancelled)
            throw new BusinessRuleException("No se puede completar una reserva cancelada");

        if (booking.Status == BookingStatus.Completed)
            throw new BusinessRuleException("La reserva ya está completada");

        // La reserva solo se puede completar después del checkout
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (today <= booking.CheckOut)
            throw new BusinessRuleException("No puedes completar la reserva antes de la fecha de salida");

        booking.Status = BookingStatus.Completed;
        await _unitOfWork.CommitAsync();

        _ = _notificationService.NotifyGuestBookingCompletedAsync(booking);

        return new CompleteBookingResponse
        {
            BookingId = booking.Id,
            Message = "Reserva completada exitosamente",
            Status = booking.Status.ToString()
        };
    }

    public async Task<IEnumerable<BookingResponse>> GetByGuestAsync(int guestId)
    {
        var bookings = await _unitOfWork.Bookings.GetByGuestIdAsync(guestId);

        return bookings
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BookingResponse
            {
                Id = b.Id,
                PropertyId = b.PropertyId,
                PropertyTitle = b.Property.Title,
                PropertyLocation = b.Property.Location,
                GuestId = b.GuestId,
                GuestName = b.Guest?.Name ?? string.Empty,
                CheckIn = b.CheckIn,
                CheckOut = b.CheckOut,
                Status = b.Status.ToString(),
                TotalPrice = b.TotalPrice,
                CreatedAt = b.CreatedAt
            });
    }

    public async Task<IEnumerable<BookingResponse>> GetByHostAsync(int hostId)
    {
        // Este método ya filtra reservas cuya propiedad pertenece al host
        var bookings = await _unitOfWork.Bookings.GetByHostIdAsync(hostId);

        return bookings
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BookingResponse
            {
                Id = b.Id,
                PropertyId = b.PropertyId,
                PropertyTitle = b.Property.Title,
                PropertyLocation = b.Property.Location,
                GuestId = b.GuestId,
                GuestName = b.Guest?.Name ?? string.Empty,
                CheckIn = b.CheckIn,
                CheckOut = b.CheckOut,
                Status = b.Status.ToString(),
                TotalPrice = b.TotalPrice,
                CreatedAt = b.CreatedAt
            });
    }
}
