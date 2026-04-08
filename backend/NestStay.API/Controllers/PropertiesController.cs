using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NestStay.API.Extensions;
using NestStay.Application.DTOs.Availability;
using NestStay.Application.DTOs.Properties;
using NestStay.Application.Interfaces.Services;

namespace NestStay.API.Controllers;

[ApiController]
[Route("api/properties")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly IAvailabilityService _availabilityService;

    public PropertiesController(
        IPropertyService propertyService,
        IAvailabilityService availabilityService)
    {
        _propertyService = propertyService;
        _availabilityService = availabilityService;
    }

    // POST /api/properties — solo el rol Host puede crear propiedades
    [HttpPost]
    [Authorize(Roles = "Host")]
    public async Task<IActionResult> Create([FromBody] CreatePropertyRequest request)
    {
        var hostId = User.GetUserId();
        var result = await _propertyService.CreateAsync(hostId, request);
        return StatusCode(201, ApiResponse<PropertyResponse>.Ok(result, "Propiedad creada exitosamente"));
    }

    // PUT /api/properties/{id} — el host actualiza su propia propiedad
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Host")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePropertyRequest request)
    {
        var hostId = User.GetUserId();
        var result = await _propertyService.UpdateAsync(hostId, id, request);
        return Ok(ApiResponse<PropertyResponse>.Ok(result, "Propiedad actualizada exitosamente"));
    }

    // DELETE /api/properties/{id} — el host elimina su propia propiedad
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Host")]
    public async Task<IActionResult> Delete(int id)
    {
        var hostId = User.GetUserId();
        await _propertyService.DeleteAsync(hostId, id);
        return Ok(ApiResponse<string>.Ok("Propiedad eliminada", "Propiedad eliminada exitosamente"));
    }

    // GET /api/properties/{id} — público, no requiere autenticación
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _propertyService.GetByIdAsync(id);
        return Ok(ApiResponse<PropertyResponse>.Ok(result));
    }

    // GET /api/properties/my-properties — listado de propiedades del host autenticado
    [HttpGet("my-properties")]
    [Authorize(Roles = "Host")]
    public async Task<IActionResult> GetMyProperties()
    {
        var hostId = User.GetUserId();
        var result = await _propertyService.GetByHostAsync(hostId);
        return Ok(ApiResponse<IEnumerable<PropertyResponse>>.Ok(result));
    }

    // POST /api/properties/{id}/block-dates — el host bloquea fechas de su propiedad
    [HttpPost("{id:int}/block-dates")]
    [Authorize(Roles = "Host")]
    public async Task<IActionResult> BlockDates(int id, [FromBody] BlockDatesRequest request)
    {
        var hostId = User.GetUserId();
        await _availabilityService.BlockDatesAsync(hostId, id, request);
        return Ok(ApiResponse<string>.Ok("Fechas bloqueadas", "Fechas bloqueadas exitosamente"));
    }

    // DELETE /api/properties/{id}/block-dates — el host desbloquea fechas de su propiedad
    [HttpDelete("{id:int}/block-dates")]
    [Authorize(Roles = "Host")]
    public async Task<IActionResult> UnblockDates(int id, [FromBody] UnblockDatesRequest request)
    {
        var hostId = User.GetUserId();
        await _availabilityService.UnblockDatesAsync(hostId, id, request);
        return Ok(ApiResponse<string>.Ok("Fechas desbloqueadas", "Fechas desbloqueadas exitosamente"));
    }

    // GET /api/properties/{id}/availability?year=&month= — público, consulta disponibilidad mensual
    [HttpGet("{id:int}/availability")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailability(int id, [FromQuery] int year, [FromQuery] int month)
    {
        var result = await _availabilityService.GetAvailabilityAsync(id, year, month);
        return Ok(ApiResponse<AvailabilityResponse>.Ok(result));
    }
}
