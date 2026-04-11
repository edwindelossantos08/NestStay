namespace NestStay.Application.DTOs.Properties;

public class AddImagesRequest
{
    public List<string> ImageUrls { get; set; } = new();
}

public class ReorderImagesRequest
{
    // IDs de imágenes en el nuevo orden deseado
    public List<int> ImageIds { get; set; } = new();
}
