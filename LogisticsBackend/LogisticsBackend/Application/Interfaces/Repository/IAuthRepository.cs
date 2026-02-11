using LogisticsBackend.Domain.Entities;

namespace LogisticsBackend.Application.Interfaces.Repository;

public interface IAuthRepository
{
    public Task <User> CreateUser(User user);
    public Task RegisterUser(User user);
    Task<User?> GetUserByEmail(string email);
    Task<User?> GetUserByIdDB(int userId);
}