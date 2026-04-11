namespace NestStay.Application.DTOs.Properties;

public class CreatePropertyRequest
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Location { get; set; } = null!;
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }
    // URL de imagen opcional, el host la pega desde cualquier fuente (compatibilidad)
    public string? ImageUrl { get; set; }
    // Lista de URLs de imágenes (mínimo 1, máximo 5). La primera es la imagen principal
    public List<string> ImageUrls { get; set; } = new();
    // Coordenadas opcionales que el frontend envía tras geocodificar
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}
