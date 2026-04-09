using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NestStay.API.Extensions;
using NestStay.Application.DTOs.Notifications;
using NestStay.Application.Interfaces.Services;

namespace NestStay.API.Controllers;

[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();
        var result = await _notificationService.GetByUserAsync(userId);
        return Ok(ApiResponse<NotificationListResponse>.Ok(result));
    }

    [HttpGet("unread")]
    [Authorize]
    public async Task<IActionResult> GetUnread()
    {
        var userId = User.GetUserId();
        var result = await _notificationService.GetUnreadByUserAsync(userId);
        return Ok(ApiResponse<NotificationListResponse>.Ok(result));
    }

    // Importante: /read-all ANTES de /{id}/read para evitar conflictos de routing
    [HttpPut("read-all")]
    [Authorize]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = User.GetUserId();
        await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(ApiResponse<string>.Ok("Todas las notificaciones marcadas como leídas"));
    }

    [HttpPut("{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userId = User.GetUserId();
        await _notificationService.MarkAsReadAsync(userId, id);
        return Ok(ApiResponse<string>.Ok("Notificación marcada como leída"));
    }
}
