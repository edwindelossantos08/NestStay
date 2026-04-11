using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NestStay.API;
using NestStay.API.Extensions;
using NestStay.Application.DTOs.Auth;
using NestStay.Application.Interfaces.Services;

namespace NestStay.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<RegisterResponse>.Ok(result, result.Message));
    }

    [HttpGet("confirm")]
    public async Task<IActionResult> ConfirmAccount([FromQuery] string token)
    {
        var result = await _authService.ConfirmAccountAsync(token);
        return Ok(ApiResponse<ConfirmAccountResponse>.Ok(result, result.Message));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        return Ok(ApiResponse<LoginResponse>.Ok(result));
    }

    [Authorize]
    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleRequest request)
    {
        var userId = User.GetUserId();
        await _authService.AssignRoleAsync(userId, request);
        return Ok(ApiResponse<string>.Ok("Rol asignado exitosamente"));
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.GetUserId();
        var result = await _authService.GetProfileAsync(userId);
        return Ok(ApiResponse<UserProfileResponse>.Ok(result));
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.GetUserId();
        var result = await _authService.UpdateProfileAsync(userId, request);
        return Ok(ApiResponse<UserProfileResponse>.Ok(result));
    }
}
