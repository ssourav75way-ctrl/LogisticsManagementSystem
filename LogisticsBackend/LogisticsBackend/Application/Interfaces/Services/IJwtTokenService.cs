using LogisticsBackend.Domain.Entities;

namespace LogisticsBackend.Application.Interfaces.Services;

public interface IJwtTokenService
{
   public string GenerateToken(User user);

}