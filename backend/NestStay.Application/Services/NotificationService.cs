using NestStay.Application.Interfaces.Services;
using NestStay.Domain.Entities;

namespace NestStay.Application.Services;

// Implementación temporal — la lógica real se implementará en la fase de notificaciones
public class NotificationService : INotificationService
{
    public Task NotifyHostNewBookingAsync(Booking booking) => Task.CompletedTask;

    public Task NotifyBookingCancelledAsync(Booking booking) => Task.CompletedTask;

    public Task NotifyGuestBookingCompletedAsync(Booking booking) => Task.CompletedTask;
}
