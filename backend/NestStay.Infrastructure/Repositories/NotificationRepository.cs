using Microsoft.EntityFrameworkCore;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Domain.Entities;
using NestStay.Infrastructure.Data;

namespace NestStay.Infrastructure.Repositories;

public class NotificationRepository : Repository<Notification>, INotificationRepository
{
    public NotificationRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Notification>> GetByUserIdAsync(int userId) =>
        await _dbSet
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

    public async Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(int userId) =>
        await _dbSet
            .Where(n => n.UserId == userId && !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
}
