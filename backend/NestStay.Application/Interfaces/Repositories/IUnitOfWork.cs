using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Repositories;

public interface IUnitOfWork
{
    IUserRepository Users { get; }
    IPropertyRepository Properties { get; }
    IBookingRepository Bookings { get; }
    IBlockedDateRepository BlockedDates { get; }
    IReviewRepository Reviews { get; }
    INotificationRepository Notifications { get; }
    IPropertyImageRepository PropertyImages { get; }
    IAmenityRepository Amenities { get; }
    IRepository<PropertyAmenity> PropertyAmenities { get; }
    Task<int> CommitAsync();
}
