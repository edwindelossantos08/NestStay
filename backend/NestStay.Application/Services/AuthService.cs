using System.IdentityModel.Tokens.Jwt;
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

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        // Mensaje genérico por seguridad, no revelar si el email existe
        var user = await _unitOfWork.Users.FindByEmailAsync(request.Email);
        if (user is null)
            throw new NotFoundException("Credenciales inválidas");

        // La cuenta debe estar confirmada antes de permitir el login
        if (!user.IsConfirmed)
            throw new BusinessRuleException("Debes confirmar tu cuenta antes de iniciar sesión");

        // Mensaje genérico para no revelar cuál campo es incorrecto
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new NotFoundException("Credenciales inválidas");

        var roles = user.GetRoles().ToList();
        var token = _jwtService.GenerateToken(user.Id, user.Email, roles);

        // Leer la expiración directamente del token generado
        var handler = new JwtSecurityTokenHandler();
        var expiresAt = handler.ReadJwtToken(token).ValidTo;

        return new LoginResponse
        {
            Token     = token,
            ExpiresAt = expiresAt,
            UserName  = user.Name,
            Roles     = roles,
            // Incluir avatar para el frontend
            AvatarUrl = user.AvatarUrl
        };
    }

    public async Task AssignRoleAsync(int userId, AssignRoleRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user is null)
            throw new NotFoundException("Usuario no encontrado");

        // Solo se permiten los roles definidos en el sistema
        if (request.Role != "Host" && request.Role != "Guest")
            throw new BusinessRuleException("Rol no válido");

        if (user.GetRoles().Contains(request.Role))
            throw new ConflictException("El usuario ya tiene ese rol");

        user.AddRole(request.Role);
        await _unitOfWork.CommitAsync();
    }

    public async Task<UserProfileResponse> GetProfileAsync(int userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        // Si no existe lanzar NotFoundException
        if (user is null)
            throw new NotFoundException("Usuario no encontrado");

        return MapToProfileResponse(user);
    }

    public async Task<UserProfileResponse> UpdateProfileAsync(int userId, UpdateProfileRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user is null)
            throw new NotFoundException("Usuario no encontrado");

        // El nombre no puede estar vacío
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new BusinessRuleException("El nombre no puede estar vacío");

        user.Name = request.Name;
        // AvatarUrl puede ser null para eliminar el avatar
        user.AvatarUrl = request.AvatarUrl;

        await _unitOfWork.CommitAsync();

        return MapToProfileResponse(user);
    }

    private static UserProfileResponse MapToProfileResponse(User user) =>
        new UserProfileResponse
        {
            Id        = user.Id,
            Name      = user.Name,
            Email     = user.Email,
            AvatarUrl = user.AvatarUrl,
            Roles     = user.GetRoles().ToList(),
            CreatedAt = user.CreatedAt
        };
}
