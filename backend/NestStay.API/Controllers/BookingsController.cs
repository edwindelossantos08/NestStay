using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NestStay.API.Extensions;
using NestStay.Application.DTOs.Bookings;
using NestStay.Application.Interfaces.Services;

namespace NestStay.API.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    [Authorize(Roles = "Guest")]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest request)
    {
        var guestId = User.GetUserId();
        var booking = await _bookingService.CreateAsync(guestId, request);
        return StatusCode(201, ApiResponse<BookingResponse>.Ok(booking, "Reserva creada exitosamente"));
    }
}
