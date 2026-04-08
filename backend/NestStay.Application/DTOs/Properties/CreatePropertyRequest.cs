namespace NestStay.Application.DTOs.Properties;

public class CreatePropertyRequest
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Location { get; set; } = null!;
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }
    // URL de imagen opcional, el host la pega desde cualquier fuente
    public string? ImageUrl { get; set; }
}
