namespace NestStay.Domain.Entities;

public class Review
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public int GuestId { get; set; }
    public int PropertyId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Booking Booking { get; set; } = null!;
    public User Guest { get; set; } = null!;
    public Property Property { get; set; } = null!;

    public Review()
    {
        CreatedAt = DateTime.UtcNow;
    }
}
