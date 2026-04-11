namespace NestStay.Application.DTOs.Properties;

public class AmenityResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    // Nombre del ícono de Lucide para renderizar en frontend
    public string Icon { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}
