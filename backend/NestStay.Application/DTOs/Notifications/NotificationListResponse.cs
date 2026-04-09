namespace NestStay.Application.DTOs.Notifications;

public class NotificationListResponse
{
    public List<NotificationResponse> Notifications { get; set; } = new();
    public int TotalCount { get; set; }
    public int UnreadCount { get; set; }
}
