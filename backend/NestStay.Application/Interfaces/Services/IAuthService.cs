using NestStay.Application.DTOs.Auth;

namespace NestStay.Application.Interfaces.Services;

public interface IAuthService
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest request);
    Task<ConfirmAccountResponse> ConfirmAccountAsync(string token);
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task AssignRoleAsync(int userId, AssignRoleRequest request);
}
