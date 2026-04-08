using NestStay.Application.DTOs.Properties;
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

        var host = await _uow.Users.GetByIdAsync(property.HostId);
        var avgRating = await _uow.Reviews.GetAverageRatingAsync(propertyId);
        var reviews = await _uow.Reviews.GetByPropertyIdAsync(propertyId);

        return MapToResponse(property, host!, avgRating, reviews.Count());
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

    // Mapeo centralizado de entidad a DTO de respuesta
    private static PropertyResponse MapToResponse(Property property, Domain.Entities.User host, double avgRating, int totalReviews) =>
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
            CreatedAt     = property.CreatedAt
        };
}
