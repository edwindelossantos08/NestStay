using Microsoft.AspNetCore.Mvc;
using NestStay.API;
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
}
