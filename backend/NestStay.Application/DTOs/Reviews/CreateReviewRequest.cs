namespace NestStay.Application.DTOs.Reviews;

public class CreateReviewRequest
{
    public int BookingId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = null!;
}
