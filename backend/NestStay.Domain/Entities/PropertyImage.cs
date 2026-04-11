namespace NestStay.Domain.Entities;

// Representa una imagen de la propiedad
public class PropertyImage
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    // URL de la imagen ingresada por el host
    public string Url { get; set; } = string.Empty;
    // Orden de visualización (0 = imagen principal)
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation
    public Property Property { get; set; } = null!;
}
