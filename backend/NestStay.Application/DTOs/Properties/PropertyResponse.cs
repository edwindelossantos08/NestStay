using NestStay.Application.DTOs.Reviews;

namespace NestStay.Application.DTOs.Properties;

public class PropertyResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Location { get; set; } = null!;
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }
    public int HostId { get; set; }
    public string HostName { get; set; } = null!;
    // Incluida en la respuesta para que el frontend pueda mostrarla
    public string? ImageUrl { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public DateTime CreatedAt { get; set; }
    // Coordenadas para el pin en el mapa
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    // Últimas 5 reseñas, solo se incluyen en GetByIdAsync
    public List<ReviewResponse> LatestReviews { get; set; } = [];
}
