using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NestStay.API.Extensions;
using NestStay.Application.DTOs.Reviews;
using NestStay.Application.Interfaces.Services;

namespace NestStay.API.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    // POST /api/reviews — solo el rol Guest puede crear reseñas
    [HttpPost]
    [Authorize(Roles = "Guest")]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequest request)
    {
        var guestId = User.GetUserId();
        var result  = await _reviewService.CreateAsync(guestId, request);
        return StatusCode(201, ApiResponse<ReviewResponse>.Ok(result, "Reseña creada exitosamente"));
    }
}
