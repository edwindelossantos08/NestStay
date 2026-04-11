using NestStay.Application.DTOs.Properties;

namespace NestStay.Application.Interfaces.Services;

public interface IPropertyService
{
    Task<PropertyResponse> CreateAsync(int hostId, CreatePropertyRequest request);
    Task<PropertyResponse> UpdateAsync(int hostId, int propertyId, UpdatePropertyRequest request);
    Task DeleteAsync(int hostId, int propertyId);
    Task<PropertyResponse> GetByIdAsync(int propertyId);
    Task<IEnumerable<PropertyResponse>> GetByHostAsync(int hostId);
    Task<SearchPropertiesResponse> SearchAsync(SearchPropertiesRequest request);
    // Métodos para gestionar imágenes de una propiedad existente
    Task<List<PropertyImageResponse>> AddImagesAsync(int hostId, int propertyId, List<string> imageUrls);
    Task DeleteImageAsync(int hostId, int propertyId, int imageId);
    Task ReorderImagesAsync(int hostId, int propertyId, List<int> imageIds);
}
