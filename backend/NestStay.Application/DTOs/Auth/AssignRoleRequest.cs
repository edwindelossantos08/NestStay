namespace NestStay.Application.DTOs.Auth;

public class AssignRoleRequest
{
    // Valores válidos: "Host", "Guest"
    public string Role { get; set; } = string.Empty;
}
