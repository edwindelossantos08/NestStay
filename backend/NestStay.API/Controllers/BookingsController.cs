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

    [HttpPost("{id}/cancel")]
    [Authorize]
    public async Task<IActionResult> Cancel(int id)
    {
        // Tanto el guest como el host pueden cancelar
        var userId = User.GetUserId();
        var result = await _bookingService.CancelAsync(userId, id);
        return Ok(ApiResponse<CancelBookingResponse>.Ok(result, result.Message));
    }

    [HttpPost("{id}/complete")]
    [Authorize(Roles = "Guest")]
    public async Task<IActionResult> Complete(int id)
    {
        var userId = User.GetUserId();
        var result = await _bookingService.CompleteAsync(userId, id);
        return Ok(ApiResponse<CompleteBookingResponse>.Ok(result, result.Message));
    }

    [HttpGet("my-bookings")]
    [Authorize(Roles = "Guest")]
    public async Task<IActionResult> GetMyBookings([FromQuery] string? status)
    {
        var guestId = User.GetUserId();
        var bookings = await _bookingService.GetByGuestAsync(guestId);

        // Si se provee, filtrar en memoria por booking.Status.ToString()
        if (!string.IsNullOrWhiteSpace(status))
            bookings = bookings.Where(b => b.Status.Equals(status, StringComparison.OrdinalIgnoreCase));

        return Ok(ApiResponse<IEnumerable<BookingResponse>>.Ok(bookings));
    }

    [HttpGet("received")]
    [Authorize(Roles = "Host")]
    public async Task<IActionResult> GetReceived([FromQuery] string? status)
    {
        var hostId = User.GetUserId();
        var bookings = await _bookingService.GetByHostAsync(hostId);

        if (!string.IsNullOrWhiteSpace(status))
            bookings = bookings.Where(b => b.Status.Equals(status, StringComparison.OrdinalIgnoreCase));

        return Ok(ApiResponse<IEnumerable<BookingResponse>>.Ok(bookings));
    }
}
