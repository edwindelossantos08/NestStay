namespace NestStay.Application.DTOs.Reviews;

public class ReviewResponse
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public int PropertyId { get; set; }
    public string GuestName { get; set; } = null!;
    // Avatar del guest que dejó la reseña
    public string? GuestAvatarUrl { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
