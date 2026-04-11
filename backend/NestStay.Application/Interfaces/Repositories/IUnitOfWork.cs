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
    Task<int> CommitAsync();
}
