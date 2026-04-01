namespace NestStay.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsConfirmed { get; set; }
    public string? ConfirmationToken { get; set; }
    public DateTime? TokenExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<Property> Properties { get; set; }
    public ICollection<Booking> Bookings { get; set; }
    public ICollection<Notification> Notifications { get; set; }
    public ICollection<Review> Reviews { get; set; }

    public User()
    {
        CreatedAt = DateTime.UtcNow;
        Properties = new List<Property>();
        Bookings = new List<Booking>();
        Notifications = new List<Notification>();
        Reviews = new List<Review>();
    }
}
