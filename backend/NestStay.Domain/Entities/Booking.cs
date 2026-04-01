using NestStay.Domain.Enums;

namespace NestStay.Domain.Entities;

public class Booking
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public int GuestId { get; set; }
    public DateOnly CheckIn { get; set; }
    public DateOnly CheckOut { get; set; }
    public BookingStatus Status { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; }

    public Property Property { get; set; } = null!;
    public User Guest { get; set; } = null!;
    public Review? Review { get; set; }

    public Booking()
    {
        CreatedAt = DateTime.UtcNow;
    }
}
