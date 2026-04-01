using NestStay.Domain.Entities;

namespace NestStay.Application.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> FindByEmailAsync(string email);
    Task<User?> FindByConfirmationTokenAsync(string token);
}
