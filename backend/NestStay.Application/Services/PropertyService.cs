using NestStay.Application.DTOs.Properties;
using NestStay.Application.DTOs.Reviews;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Application.Interfaces.Services;
using NestStay.Domain.Entities;
using NestStay.Domain.Exceptions;

namespace NestStay.Application.Services;

public class PropertyService : IPropertyService
{
    private readonly IUnitOfWork _uow;

    public PropertyService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<PropertyResponse> CreateAsync(int hostId, CreatePropertyRequest request)
    {
        // El HostId viene del JWT, no del body
        var property = new Property
        {
            HostId        = hostId,
            Title         = request.Title,
            Description   = request.Description,
            Location      = request.Location,
            PricePerNight = request.PricePerNight,
            Capacity      = request.Capacity,
            // Guardar la URL tal como la ingresó el host
            ImageUrl      = request.ImageUrl,
            Latitude      = request.Latitude,
            Longitude     = request.Longitude,
            CreatedAt     = DateTime.UtcNow
        };

        await _uow.Properties.AddAsync(property);
        await _uow.CommitAsync();

        // Cargar el host para incluir su nombre en la respuesta
        var host = await _uow.Users.GetByIdAsync(hostId);

        return MapToResponse(property, host!, 0, 0);
    }

    public async Task<PropertyResponse> UpdateAsync(int hostId, int propertyId, UpdatePropertyRequest request)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);

        // Si no existe lanzar NotFoundException
        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        // Si no es el dueño lanzar UnauthorizedException
        if (property.HostId != hostId)
            throw new UnauthorizedException();

        property.Title         = request.Title;
        property.Description   = request.Description;
        property.Location      = request.Location;
        property.PricePerNight = request.PricePerNight;
        property.Capacity      = request.Capacity;
        // Permite reemplazar o limpiar la imagen
        property.ImageUrl      = request.ImageUrl;
        property.Latitude      = request.Latitude;
        property.Longitude     = request.Longitude;

        await _uow.CommitAsync();

        var host = await _uow.Users.GetByIdAsync(hostId);
        var avgRating = await _uow.Reviews.GetAverageRatingAsync(propertyId);
        var reviews = await _uow.Reviews.GetByPropertyIdAsync(propertyId);

        return MapToResponse(property, host!, avgRating, reviews.Count());
    }

    public async Task DeleteAsync(int hostId, int propertyId)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);

        // Si no existe lanzar NotFoundException
        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        // Si no es el dueño lanzar UnauthorizedException
        if (property.HostId != hostId)
            throw new UnauthorizedException();

        _uow.Properties.Delete(property);
        await _uow.CommitAsync();
    }

    public async Task<PropertyResponse> GetByIdAsync(int propertyId)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);

        // Si no existe lanzar NotFoundException
        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        var host      = await _uow.Users.GetByIdAsync(property.HostId);
        var avgRating = await _uow.Reviews.GetAverageRatingAsync(propertyId);
        var reviews   = (await _uow.Reviews.GetByPropertyIdAsync(propertyId)).ToList();

        // Últimas 5 reseñas ordenadas por fecha descendente
        var latestReviews = reviews
            .OrderByDescending(r => r.CreatedAt)
            .Take(5)
            .Select(r => new ReviewResponse
            {
                Id         = r.Id,
                BookingId  = r.BookingId,
                PropertyId = r.PropertyId,
                GuestName  = r.Guest!.Name,
                Rating     = r.Rating,
                Comment    = r.Comment,
                CreatedAt  = r.CreatedAt
            })
            .ToList();

        return MapToResponse(property, host!, avgRating, reviews.Count, latestReviews);
    }

    public async Task<IEnumerable<PropertyResponse>> GetByHostAsync(int hostId)
    {
        var properties = await _uow.Properties.GetByHostIdAsync(hostId);
        var host = await _uow.Users.GetByIdAsync(hostId);

        var result = new List<PropertyResponse>();

        foreach (var property in properties)
        {
            var avgRating = await _uow.Reviews.GetAverageRatingAsync(property.Id);
            var reviews = await _uow.Reviews.GetByPropertyIdAsync(property.Id);
            result.Add(MapToResponse(property, host!, avgRating, reviews.Count()));
        }

        return result;
    }

    public async Task<SearchPropertiesResponse> SearchAsync(SearchPropertiesRequest request)
    {
        // Si solo se provee uno de los dos, lanzar error
        if (request.CheckIn.HasValue && !request.CheckOut.HasValue ||
            !request.CheckIn.HasValue && request.CheckOut.HasValue)
            throw new BusinessRuleException("Debes proveer tanto CheckIn como CheckOut");

        if (request.CheckIn.HasValue && request.CheckOut.HasValue)
        {
            // La fecha de entrada no puede ser en el pasado
            if (request.CheckIn.Value < DateOnly.FromDateTime(DateTime.UtcNow))
                throw new BusinessRuleException("La fecha de entrada no puede ser en el pasado");

            // La fecha de salida debe ser posterior a la entrada
            if (request.CheckOut.Value <= request.CheckIn.Value)
                throw new BusinessRuleException("La fecha de salida debe ser posterior a la entrada");
        }

        // Corregir silenciosamente valores fuera de rango
        if (request.Page < 1) request.Page = 1;
        if (request.PageSize < 1) request.PageSize = 1;
        if (request.PageSize > 50) request.PageSize = 50;

        var properties = await _uow.Properties.SearchAvailableAsync(
            request.Location,
            request.CheckIn,
            request.CheckOut,
            request.Capacity,
            request.MinPrice,
            request.MaxPrice,
            request.Page,
            request.PageSize);

        // Contar el total sin paginación para calcular TotalPages
        var totalCount = await _uow.Properties.CountSearchResultsAsync(
            request.Location,
            request.CheckIn,
            request.CheckOut,
            request.Capacity,
            request.MinPrice,
            request.MaxPrice);

        var result = new List<PropertyResponse>();
        foreach (var property in properties)
        {
            var avgRating = await _uow.Reviews.GetAverageRatingAsync(property.Id);
            var reviews = await _uow.Reviews.GetByPropertyIdAsync(property.Id);
            result.Add(MapToResponse(property, property.Host!, avgRating, reviews.Count()));
        }

        return new SearchPropertiesResponse
        {
            Properties = result,
            TotalCount = totalCount,
            Page       = request.Page,
            PageSize   = request.PageSize
        };
    }

    // Mapeo centralizado de entidad a DTO de respuesta
    private static PropertyResponse MapToResponse(
        Property property,
        Domain.Entities.User host,
        double avgRating,
        int totalReviews,
        List<ReviewResponse>? latestReviews = null) =>
        new PropertyResponse
        {
            Id            = property.Id,
            Title         = property.Title,
            Description   = property.Description,
            Location      = property.Location,
            PricePerNight = property.PricePerNight,
            Capacity      = property.Capacity,
            HostId        = property.HostId,
            HostName      = host.Name,
            ImageUrl      = property.ImageUrl,
            AverageRating = avgRating,
            TotalReviews  = totalReviews,
            CreatedAt     = property.CreatedAt,
            Latitude      = property.Latitude,
            Longitude     = property.Longitude,
            LatestReviews = latestReviews ?? []
        };
}
