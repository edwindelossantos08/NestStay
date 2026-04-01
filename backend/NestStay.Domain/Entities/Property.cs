namespace NestStay.Domain.Entities;

public class Property
{
    public int Id { get; set; }
    public int HostId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }
    // URL de imagen de la propiedad, ingresada por el host (opcional)
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }

    public User Host { get; set; } = null!;
    public ICollection<Booking> Bookings { get; set; }
    public ICollection<BlockedDate> BlockedDates { get; set; }
    public ICollection<Review> Reviews { get; set; }

    public Property()
    {
        CreatedAt = DateTime.UtcNow;
        Bookings = new List<Booking>();
        BlockedDates = new List<BlockedDate>();
        Reviews = new List<Review>();
    }
}
