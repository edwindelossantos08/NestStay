using NestStay.Application.DTOs.Properties;
using NestStay.Application.DTOs.Reviews;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Application.Interfaces.Services;
using NestStay.Domain.Entities;
using NestStay.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace NestStay.Application.Services;

public class PropertyService : IPropertyService
{
    private readonly IUnitOfWork _uow;
    private readonly DbContext _context;

    public PropertyService(IUnitOfWork uow, DbContext context)
    {
        _uow = uow;
        _context = context;
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
            // Guardar la URL tal como la ingresó el host (compatibilidad)
            ImageUrl      = request.ImageUrl,
            Latitude      = request.Latitude,
            Longitude     = request.Longitude,
            CreatedAt     = DateTime.UtcNow
        };

        await _uow.Properties.AddAsync(property);
        await _uow.CommitAsync();

        // Guardar las imágenes si se proporcionaron
        if (request.ImageUrls.Any())
        {
            var images = request.ImageUrls
                .Take(5) // máximo 5 imágenes
                .Select((url, index) => new PropertyImage
                {
                    PropertyId   = property.Id,
                    Url          = url,
                    DisplayOrder = index
                });

            foreach (var image in images)
                await _uow.PropertyImages.AddAsync(image);

            // La primera imagen es la principal (compatibilidad con ImageUrl)
            property.ImageUrl = request.ImageUrls.First();

            await _uow.CommitAsync();
        }

        // Asignar amenidades si se enviaron
        if (request.AmenityIds.Any())
        {
            var amenities = await _uow.Amenities.GetByIdsAsync(request.AmenityIds);

            foreach (var amenity in amenities)
            {
                await _uow.PropertyAmenities.AddAsync(new PropertyAmenity
                {
                    PropertyId = property.Id,
                    AmenityId = amenity.Id
                });
            }
            await _uow.CommitAsync();
        }

        // Cargar el host para incluir su nombre en la respuesta
        var host = await _uow.Users.GetByIdAsync(hostId);
        return await MapToResponseAsync(property, host!, 0, 0);
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
        // Permite reemplazar o limpiar la imagen (compatibilidad)
        property.ImageUrl      = request.ImageUrl;
        property.Latitude      = request.Latitude;
        property.Longitude     = request.Longitude;

        // Reemplazar todas las imágenes si se enviaron nuevas
        if (request.ImageUrls.Any())
        {
            // Eliminar imágenes anteriores
            await _uow.PropertyImages.DeleteByPropertyIdAsync(property.Id);

            // Agregar las nuevas
            var images = request.ImageUrls
                .Take(5)
                .Select((url, index) => new PropertyImage
                {
                    PropertyId   = property.Id,
                    Url          = url,
                    DisplayOrder = index
                });

            foreach (var image in images)
                await _uow.PropertyImages.AddAsync(image);

            property.ImageUrl = request.ImageUrls.First();
        }

        // Reemplazar amenidades si se enviaron
        if (request.AmenityIds.Any())
        {
            // Eliminar relaciones anteriores
            var existing = await _context.Set<PropertyAmenity>()
                .Where(pa => pa.PropertyId == property.Id)
                .ToListAsync();
            _context.Set<PropertyAmenity>().RemoveRange(existing);

            // Agregar las nuevas
            foreach (var amenityId in request.AmenityIds)
            {
                await _uow.PropertyAmenities.AddAsync(new PropertyAmenity
                {
                    PropertyId = property.Id,
                    AmenityId = amenityId
                });
            }
        }

        await _uow.CommitAsync();

        var host = await _uow.Users.GetByIdAsync(hostId);
        var avgRating = await _uow.Reviews.GetAverageRatingAsync(propertyId);
        var reviews = await _uow.Reviews.GetByPropertyIdAsync(propertyId);

        return await MapToResponseAsync(property, host!, avgRating, reviews.Count());
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

        return await MapToResponseAsync(property, host!, avgRating, reviews.Count, latestReviews);
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
            result.Add(await MapToResponseAsync(property, host!, avgRating, reviews.Count()));
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
            result.Add(await MapToResponseAsync(property, property.Host!, avgRating, reviews.Count()));
        }

        return new SearchPropertiesResponse
        {
            Properties = result,
            TotalCount = totalCount,
            Page       = request.Page,
            PageSize   = request.PageSize
        };
    }

    // Agrega imágenes hasta completar 5 en total
    public async Task<List<PropertyImageResponse>> AddImagesAsync(int hostId, int propertyId, List<string> imageUrls)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);

        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        if (property.HostId != hostId)
            throw new UnauthorizedException();

        var existing = (await _uow.PropertyImages.GetByPropertyIdAsync(propertyId)).ToList();
        int availableSlots = 5 - existing.Count;

        // Si ya tiene 5 imágenes no se pueden agregar más
        if (availableSlots <= 0)
            throw new BusinessRuleException("La propiedad ya tiene el máximo de 5 imágenes");

        int nextOrder = existing.Any() ? existing.Max(i => i.DisplayOrder) + 1 : 0;

        var toAdd = imageUrls.Take(availableSlots).ToList();
        foreach (var url in toAdd)
        {
            await _uow.PropertyImages.AddAsync(new PropertyImage
            {
                PropertyId   = propertyId,
                Url          = url,
                DisplayOrder = nextOrder++
            });
        }

        // Si la propiedad no tiene imagen principal, asignar la primera nueva
        if (property.ImageUrl is null && toAdd.Any())
            property.ImageUrl = toAdd.First();

        await _uow.CommitAsync();

        var all = await _uow.PropertyImages.GetByPropertyIdAsync(propertyId);
        return all.Select(i => new PropertyImageResponse
        {
            Id           = i.Id,
            Url          = i.Url,
            DisplayOrder = i.DisplayOrder
        }).ToList();
    }

    // Elimina una imagen específica y actualiza ImageUrl si era la principal
    public async Task DeleteImageAsync(int hostId, int propertyId, int imageId)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);

        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        if (property.HostId != hostId)
            throw new UnauthorizedException();

        var image = await _uow.PropertyImages.GetByIdAsync(imageId);

        if (image is null || image.PropertyId != propertyId)
            throw new NotFoundException("Imagen", imageId);

        _uow.PropertyImages.Delete(image);
        await _uow.CommitAsync();

        // Actualizar ImageUrl hacia la nueva primera imagen
        var remaining = await _uow.PropertyImages.GetByPropertyIdAsync(propertyId);
        property.ImageUrl = remaining.FirstOrDefault()?.Url;
        await _uow.CommitAsync();
    }

    // Reordena las imágenes según el array de IDs recibido
    public async Task ReorderImagesAsync(int hostId, int propertyId, List<int> imageIds)
    {
        var property = await _uow.Properties.GetByIdAsync(propertyId);

        if (property is null)
            throw new NotFoundException("Propiedad", propertyId);

        if (property.HostId != hostId)
            throw new UnauthorizedException();

        var images = (await _uow.PropertyImages.GetByPropertyIdAsync(propertyId)).ToList();

        // Actualizar DisplayOrder según la posición en el array
        for (int i = 0; i < imageIds.Count; i++)
        {
            var image = images.FirstOrDefault(img => img.Id == imageIds[i]);
            if (image is not null)
                image.DisplayOrder = i;
        }

        // ImageUrl apunta siempre a la primera imagen del nuevo orden
        var firstId = imageIds.FirstOrDefault();
        var first = images.FirstOrDefault(img => img.Id == firstId);
        if (first is not null)
            property.ImageUrl = first.Url;

        await _uow.CommitAsync();
    }

    // Mapeo centralizado de entidad a DTO de respuesta (async para cargar imágenes)
    private async Task<PropertyResponse> MapToResponseAsync(
        Property property,
        Domain.Entities.User host,
        double avgRating,
        int totalReviews,
        List<ReviewResponse>? latestReviews = null)
    {
        // Cargar las imágenes de la propiedad
        var images = (await _uow.PropertyImages.GetByPropertyIdAsync(property.Id)).ToList();

        // Incluir amenidades en la respuesta
        var propertyAmenities = await _context.Set<PropertyAmenity>()
            .Include(pa => pa.Amenity)
            .Where(pa => pa.PropertyId == property.Id)
            .ToListAsync();

        var amenitiesList = propertyAmenities
            .Select(pa => new AmenityResponse
            {
                Id = pa.Amenity.Id,
                Name = pa.Amenity.Name,
                Icon = pa.Amenity.Icon,
                Category = pa.Amenity.Category
            })
            .OrderBy(a => a.Category)
            .ToList();

        return new PropertyResponse
        {
            Id            = property.Id,
            Title         = property.Title,
            Description   = property.Description,
            Location      = property.Location,
            PricePerNight = property.PricePerNight,
            Capacity      = property.Capacity,
            HostId        = property.HostId,
            HostName      = host.Name,
            // Mantener ImageUrl apuntando a la primera imagen
            ImageUrl      = images.FirstOrDefault()?.Url ?? property.ImageUrl,
            Images        = images.Select(i => new PropertyImageResponse
            {
                Id           = i.Id,
                Url          = i.Url,
                DisplayOrder = i.DisplayOrder
            }).ToList(),
            AverageRating = avgRating,
            TotalReviews  = totalReviews,
            CreatedAt     = property.CreatedAt,
            Latitude      = property.Latitude,
            Longitude     = property.Longitude,
            Amenities     = amenitiesList,
            LatestReviews = latestReviews ?? []
        };
    }
}
