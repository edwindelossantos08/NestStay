using BCrypt.Net;
using NestStay.Application.DTOs.Auth;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Application.Interfaces.Services;
using NestStay.Domain.Entities;
using NestStay.Domain.Exceptions;

namespace NestStay.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;

    public AuthService(IUnitOfWork unitOfWork, IJwtService jwtService, IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _emailService = emailService;
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        // Si las contraseñas no coinciden, no continuar
        if (request.Password != request.ConfirmPassword)
            throw new BusinessRuleException("Las contraseñas no coinciden");

        // Verificar si el email ya está en uso
        var existing = await _unitOfWork.Users.FindByEmailAsync(request.Email);
        if (existing is not null)
            throw new ConflictException("El correo ya está registrado");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // El token expira en 24 horas
        var confirmationToken = Guid.NewGuid().ToString("N");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = passwordHash,
            IsConfirmed = false,
            ConfirmationToken = confirmationToken,
            TokenExpiresAt = DateTime.UtcNow.AddHours(24),
            Roles = "Guest"
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.CommitAsync();

        // Fire-and-forget: no bloquea el registro si falla el email
        _ = _emailService.SendConfirmationEmailAsync(user.Email, user.Name, confirmationToken);

        return new RegisterResponse
        {
            Message = "Registro exitoso. Revisa tu correo para confirmar tu cuenta."
        };
    }

    public async Task<ConfirmAccountResponse> ConfirmAccountAsync(string token)
    {
        // Buscar usuario por token; si no existe el token es inválido
        var user = await _unitOfWork.Users.FindByConfirmationTokenAsync(token);
        if (user is null)
            throw new NotFoundException("Token inválido");

        // Verificar que el token no haya expirado
        if (user.TokenExpiresAt <= DateTime.UtcNow)
            throw new BusinessRuleException("El token ha expirado, solicita un nuevo correo");

        // Verificar que la cuenta no haya sido confirmada previamente
        if (user.IsConfirmed)
            throw new BusinessRuleException("La cuenta ya fue confirmada");

        user.IsConfirmed = true;
        user.ConfirmationToken = null;
        user.TokenExpiresAt = null;

        await _unitOfWork.CommitAsync();

        return new ConfirmAccountResponse
        {
            Message = "Cuenta confirmada exitosamente. Ya puedes iniciar sesión."
        };
    }
}
