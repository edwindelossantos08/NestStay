namespace NestStay.Domain.Entities;

// Relación muchos-a-muchos entre Property y Amenity
public class PropertyAmenity
{
    public int PropertyId { get; set; }
    public int AmenityId { get; set; }

    // Navigation
    public Property Property { get; set; } = null!;
    public Amenity Amenity { get; set; } = null!;
}
