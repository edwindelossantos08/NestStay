using NestStay.Application.DTOs.Notifications;
using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Services;

public interface INotificationService
{
    // Métodos de eventos de negocio (llamados desde BookingService)
    Task NotifyHostNewBookingAsync(Booking booking);
    Task NotifyBookingCancelledAsync(Booking booking);
    Task NotifyGuestBookingCompletedAsync(Booking booking);

    // Métodos de consulta para el usuario
    Task<NotificationListResponse> GetByUserAsync(int userId);
    Task<NotificationListResponse> GetUnreadByUserAsync(int userId);
    Task MarkAsReadAsync(int userId, int notificationId);
    Task MarkAllAsReadAsync(int userId);
}
