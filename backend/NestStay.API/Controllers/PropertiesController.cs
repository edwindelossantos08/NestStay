using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NestStay.API.Extensions;
using NestStay.Application.DTOs.Properties;
using NestStay.Application.Interfaces.Services;

namespace NestStay.API.Controllers;

[ApiController]
[Route("api/properties")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _propertyService;

    public PropertiesController(IPropertyService propertyService)
    {
        _propertyService = propertyService;
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
}
