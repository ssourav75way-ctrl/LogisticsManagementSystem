using LogisticsBackend.Application.Interfaces.Repository;
using LogisticsBackend.Domain.Entities;
using LogisticsBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsBackend.Infrastructure.Repositories;
public class AuthRepository : IAuthRepository
{
    private readonly AppDbContext _context;

    public AuthRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User> CreateUser(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task RegisterUser(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetUserByEmail(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserByIdDB(int userId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<int> UpdateUserStatusDB(int userId, string status)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return 0;
        user.Status = status;
        _context.Users.Update(user);
        return await _context.SaveChangesAsync();
    }
}
