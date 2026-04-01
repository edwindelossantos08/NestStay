using NestStay.Application.Interfaces.Repositories;
using NestStay.Infrastructure.Data;

namespace NestStay.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public IUserRepository Users { get; }
    public IPropertyRepository Properties { get; }
    public IBookingRepository Bookings { get; }
    public IBlockedDateRepository BlockedDates { get; }
    public IReviewRepository Reviews { get; }
    public INotificationRepository Notifications { get; }

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Users = new UserRepository(context);
        Properties = new PropertyRepository(context);
        Bookings = new BookingRepository(context);
        BlockedDates = new BlockedDateRepository(context);
        Reviews = new ReviewRepository(context);
        Notifications = new NotificationRepository(context);
    }

    public async Task<int> CommitAsync() =>
        await _context.SaveChangesAsync();
}
