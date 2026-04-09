namespace NestStay.Application.DTOs.Reviews;

public class ReviewResponse
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public int PropertyId { get; set; }
    public string GuestName { get; set; } = null!;
    public int Rating { get; set; }
    public string Comment { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
