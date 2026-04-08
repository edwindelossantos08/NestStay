namespace NestStay.Application.DTOs.Properties;

public class SearchPropertiesResponse
{
    public List<PropertyResponse> Properties { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    // Calculado a partir del total y el tamaño de página
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
