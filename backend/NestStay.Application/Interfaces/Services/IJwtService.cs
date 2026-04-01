namespace NestStay.Application.Interfaces.Services;

public interface IJwtService
{
    string GenerateToken(int userId, string email, IEnumerable<string> roles);
}
