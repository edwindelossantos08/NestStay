using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NestStay.API.Extensions;
using NestStay.Application.DTOs.Properties;
using NestStay.Application.Interfaces.Services;

namespace NestStay.API.Controllers;

[ApiController]
[Route("api/amenities")]
public class AmenitiesController : ControllerBase
{
    private readonly IAmenityService _amenityService;

    public AmenitiesController(IAmenityService amenityService)
    {
        _amenityService = amenityService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var amenities = await _amenityService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<AmenityResponse>>.Ok(amenities));
    }
}
