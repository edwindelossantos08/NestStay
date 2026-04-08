using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Services;

// Interfaz que se implementará completamente en la fase de notificaciones
public interface INotificationService
{
    Task NotifyHostNewBookingAsync(Booking booking);
    Task NotifyBookingCancelledAsync(Booking booking);
    Task NotifyGuestBookingCompletedAsync(Booking booking);
}
