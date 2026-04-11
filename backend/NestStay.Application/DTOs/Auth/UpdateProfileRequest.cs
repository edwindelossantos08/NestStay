namespace NestStay.Application.DTOs.Auth;

public class UpdateProfileRequest
{
    public string Name { get; set; } = string.Empty;
    // URL del avatar — el usuario pega una URL de imagen
    public string? AvatarUrl { get; set; }
}
