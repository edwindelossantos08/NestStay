using NestStay.Application.DTOs.Reviews;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Application.Interfaces.Services;
using NestStay.Domain.Entities;
using NestStay.Domain.Enums;
using NestStay.Domain.Exceptions;

namespace NestStay.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _uow;

    public ReviewService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<ReviewResponse> CreateAsync(int guestId, CreateReviewRequest request)
    {
        // La calificación debe estar en el rango permitido
        if (request.Rating < 1 || request.Rating > 5)
            throw new BusinessRuleException("La calificación debe estar entre 1 y 5");

        var booking = await _uow.Bookings.GetByIdAsync(request.BookingId);

        // La reserva debe existir
        if (booking is null)
            throw new NotFoundException("Reserva no encontrada");

        // Solo el guest que hizo la reserva puede dejar la reseña
        if (booking.GuestId != guestId)
            throw new UnauthorizedException("No puedes reseñar una reserva que no es tuya");

        // Solo se pueden reseñar reservas completadas
        if (booking.Status != BookingStatus.Completed)
            throw new BusinessRuleException("Solo puedes reseñar reservas completadas");

        // Verificar que no exista ya una reseña para esta reserva
        var existing = await _uow.Reviews.GetByBookingIdAsync(request.BookingId);
        if (existing is not null)
            throw new ConflictException("Ya dejaste una reseña para esta reserva");

        var review = new Review
        {
            BookingId  = request.BookingId,
            GuestId    = guestId,
            // El PropertyId se obtiene de la reserva, no del body
            PropertyId = booking.PropertyId,
            Rating     = request.Rating,
            Comment    = request.Comment,
            CreatedAt  = DateTime.UtcNow
        };

        await _uow.Reviews.AddAsync(review);
        await _uow.CommitAsync();

        // Cargar el guest para incluir su nombre en la respuesta
        var guest = await _uow.Users.GetByIdAsync(guestId);

        return MapToResponse(review, guest!.Name);
    }

    public async Task<PropertyReviewsResponse> GetByPropertyAsync(int propertyId)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);

        // La propiedad debe existir
        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        // GetByPropertyIdAsync ya incluye navegación al Guest
        var reviews    = await _uow.Reviews.GetByPropertyIdAsync(propertyId);
        var avgRating  = await _uow.Reviews.GetAverageRatingAsync(propertyId);
        var reviewList = reviews.ToList();

        return new PropertyReviewsResponse
        {
            PropertyId    = property.Id,
            PropertyTitle = property.Title,
            AverageRating = avgRating,
            TotalReviews  = reviewList.Count,
            Reviews       = reviewList.Select(r => MapToResponse(r, r.Guest!.Name)).ToList()
        };
    }

    private static ReviewResponse MapToResponse(Review review, string guestName) =>
        new ReviewResponse
        {
            Id         = review.Id,
            BookingId  = review.BookingId,
            PropertyId = review.PropertyId,
            GuestName  = guestName,
            Rating     = review.Rating,
            Comment    = review.Comment,
            CreatedAt  = review.CreatedAt
        };
}
