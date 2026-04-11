using NestStay.Application.DTOs.Reviews;
using NestStay.Application.DTOs.Properties;

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
    // Avatar del host para mostrar en el detalle de la propiedad
    public string? HostAvatarUrl { get; set; }
    // Lista de imágenes ordenadas por DisplayOrder
    public List<PropertyImageResponse> Images { get; set; } = new();
    // Mantener ImageUrl para compatibilidad con el frontend actual
    // Apunta a la primera imagen de la colección si existe
    public string? ImageUrl { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public DateTime CreatedAt { get; set; }
    // Coordenadas para el pin en el mapa
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    // Amenidades agrupadas por categoría
    public List<AmenityResponse> Amenities { get; set; } = new();
    // Últimas 5 reseñas, solo se incluyen en GetByIdAsync
    public List<ReviewResponse> LatestReviews { get; set; } = [];
}
