namespace NestStay.Domain.Entities;

// Amenidad disponible en el sistema (WiFi, Piscina, etc.)
public class Amenity
{
    public int Id { get; set; }
    // Nombre de la amenidad
    public string Name { get; set; } = string.Empty;
    // Nombre del ícono de Lucide React a usar en el frontend
    public string Icon { get; set; } = string.Empty;
    // Categoría para agrupar en el detalle de propiedad
    public string Category { get; set; } = string.Empty;

    // Navigation
    public ICollection<PropertyAmenity> PropertyAmenities { get; set; }
        = new List<PropertyAmenity>();
}
