namespace NestStay.Application.DTOs.Properties;

public class UpdatePropertyRequest
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Location { get; set; } = null!;
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }
    // Permite actualizar la imagen al editar la propiedad (compatibilidad)
    public string? ImageUrl { get; set; }
    // Reemplaza todas las imágenes al actualizar
    public List<string> ImageUrls { get; set; } = new();
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}
