using Microsoft.EntityFrameworkCore;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Domain.Entities;
using NestStay.Infrastructure.Data;

namespace NestStay.Infrastructure.Repositories;

public class PropertyImageRepository : Repository<PropertyImage>, IPropertyImageRepository
{
    public PropertyImageRepository(ApplicationDbContext context) : base(context) { }

    // Retorna las imágenes de una propiedad ordenadas por DisplayOrder
    public async Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(int propertyId) =>
        await _dbSet
            .Where(pi => pi.PropertyId == propertyId)
            .OrderBy(pi => pi.DisplayOrder)
            .ToListAsync();

    // Elimina todas las imágenes de una propiedad
    public async Task DeleteByPropertyIdAsync(int propertyId)
    {
        var images = await _dbSet
            .Where(pi => pi.PropertyId == propertyId)
            .ToListAsync();

        _dbSet.RemoveRange(images);
    }
}
