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
    // Coordenadas geográficas opcionales para mostrar en el mapa
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public DateTime CreatedAt { get; set; }

    public User Host { get; set; } = null!;
    public ICollection<Booking> Bookings { get; set; }
    public ICollection<BlockedDate> BlockedDates { get; set; }
    public ICollection<Review> Reviews { get; set; }
    // Colección de imágenes de la propiedad
    public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
    // Amenidades de la propiedad
    public ICollection<PropertyAmenity> PropertyAmenities { get; set; } = new List<PropertyAmenity>();

    public Property()
    {
        CreatedAt = DateTime.UtcNow;
        Bookings = new List<Booking>();
        BlockedDates = new List<BlockedDate>();
        Reviews = new List<Review>();
        Images = new List<PropertyImage>();
    }
}
