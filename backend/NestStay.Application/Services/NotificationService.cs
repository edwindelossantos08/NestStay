using Microsoft.Extensions.Logging;
using NestStay.Application.DTOs.Notifications;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Application.Interfaces.Services;
using NestStay.Domain.Entities;
using NestStay.Domain.Exceptions;

namespace NestStay.Application.Services;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        IUnitOfWork unitOfWork,
        IEmailService emailService,
        ILogger<NotificationService> logger)
    {
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task NotifyHostNewBookingAsync(Booking booking)
    {
        try
        {
            var property = await _unitOfWork.Properties.GetByIdAsync(booking.PropertyId);
            if (property == null) return;

            var host = await _unitOfWork.Users.GetByIdAsync(property.HostId);
            if (host == null) return;

            var notification = new Notification
            {
                UserId = host.Id,
                Message = $"Nueva reserva recibida para '{property.Title}' del {booking.CheckIn:dd/MM/yyyy} al {booking.CheckOut:dd/MM/yyyy}",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Notifications.AddAsync(notification);
            await _unitOfWork.CommitAsync();

            try
            {
                // Fire-and-forget: no bloquea ni propaga excepciones de email
                _ = _emailService.SendBookingCreatedEmailAsync(
                    host.Email,
                    host.Name,
                    property.Title,
                    booking.CheckIn,
                    booking.CheckOut);
            }
            catch (Exception ex)
            {
                // Solo logueamos, nunca propagamos el error de email
                _logger.LogError(ex, "Error al enviar email de nueva reserva");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al notificar al host sobre nueva reserva para la reserva {BookingId}", booking.Id);
        }
    }

    public async Task NotifyBookingCancelledAsync(Booking booking)
    {
        try
        {
            var property = await _unitOfWork.Properties.GetByIdAsync(booking.PropertyId);
            if (property == null) return;

            var host = await _unitOfWork.Users.GetByIdAsync(property.HostId);
            var guest = await _unitOfWork.Users.GetByIdAsync(booking.GuestId);

            // Ambas notificaciones en el mismo commit para consistencia
            if (host != null)
            {
                var hostNotification = new Notification
                {
                    UserId = host.Id,
                    Message = $"La reserva para '{property.Title}' del {booking.CheckIn:dd/MM/yyyy} al {booking.CheckOut:dd/MM/yyyy} ha sido cancelada",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.Notifications.AddAsync(hostNotification);
            }

            if (guest != null)
            {
                var guestNotification = new Notification
                {
                    UserId = guest.Id,
                    Message = $"Tu reserva en '{property.Title}' del {booking.CheckIn:dd/MM/yyyy} al {booking.CheckOut:dd/MM/yyyy} ha sido cancelada",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.Notifications.AddAsync(guestNotification);
            }

            await _unitOfWork.CommitAsync();

            try
            {
                if (host != null)
                    _ = _emailService.SendBookingCancelledEmailAsync(host.Email, host.Name, property.Title);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al enviar email de cancelación al host");
            }

            try
            {
                if (guest != null)
                    _ = _emailService.SendBookingCancelledEmailAsync(guest.Email, guest.Name, property.Title);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al enviar email de cancelación al guest");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al notificar cancelación para la reserva {BookingId}", booking.Id);
        }
    }

    public async Task NotifyGuestBookingCompletedAsync(Booking booking)
    {
        try
        {
            var property = await _unitOfWork.Properties.GetByIdAsync(booking.PropertyId);
            if (property == null) return;

            var guest = await _unitOfWork.Users.GetByIdAsync(booking.GuestId);
            if (guest == null) return;

            var notification = new Notification
            {
                UserId = guest.Id,
                Message = $"Tu estancia en '{property.Title}' ha sido completada. ¡Esperamos que hayas disfrutado!",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Notifications.AddAsync(notification);
            await _unitOfWork.CommitAsync();

            try
            {
                // Fire-and-forget: no bloquea ni propaga excepciones de email
                _ = _emailService.SendBookingCompletedEmailAsync(guest.Email, guest.Name, property.Title);
            }
            catch (Exception ex)
            {
                // Solo logueamos, nunca propagamos el error de email
                _logger.LogError(ex, "Error al enviar email de reserva completada");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al notificar al guest sobre reserva completada {BookingId}", booking.Id);
        }
    }

    public async Task<NotificationListResponse> GetByUserAsync(int userId)
    {
        // Ya ordenadas por CreatedAt descendente en el repositorio
        var notifications = await _unitOfWork.Notifications.GetByUserIdAsync(userId);
        var list = notifications.ToList();

        return new NotificationListResponse
        {
            Notifications = list.Select(MapToResponse).ToList(),
            TotalCount = list.Count,
            UnreadCount = list.Count(n => !n.IsRead)
        };
    }

    public async Task<NotificationListResponse> GetUnreadByUserAsync(int userId)
    {
        var notifications = await _unitOfWork.Notifications.GetUnreadByUserIdAsync(userId);
        var list = notifications.ToList();

        return new NotificationListResponse
        {
            Notifications = list.Select(MapToResponse).ToList(),
            TotalCount = list.Count,
            UnreadCount = list.Count
        };
    }

    public async Task MarkAsReadAsync(int userId, int notificationId)
    {
        var notification = await _unitOfWork.Notifications.GetByIdAsync(notificationId)
            ?? throw new NotFoundException("Notificación no encontrada");

        // Cada usuario solo puede modificar sus propias notificaciones
        if (notification.UserId != userId)
            throw new UnauthorizedException("No puedes modificar notificaciones de otro usuario");

        notification.IsRead = true;
        await _unitOfWork.CommitAsync();
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        var unread = await _unitOfWork.Notifications.GetUnreadByUserIdAsync(userId);

        foreach (var notification in unread)
        {
            notification.IsRead = true;
            // Actualizar en bloque, un solo CommitAsync al final
            _unitOfWork.Notifications.Update(notification);
        }

        await _unitOfWork.CommitAsync();
    }

    private static NotificationResponse MapToResponse(Notification n) => new()
    {
        Id = n.Id,
        Message = n.Message,
        IsRead = n.IsRead,
        CreatedAt = n.CreatedAt
    };
}
