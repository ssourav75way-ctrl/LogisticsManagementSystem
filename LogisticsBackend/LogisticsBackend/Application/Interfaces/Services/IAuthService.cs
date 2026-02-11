using LogisticsBackend.Application.DTO.AuthDTO_s;

namespace LogisticsBackend.Application.Interfaces.Services;

public interface IAuthService
{
        Task<LoginResponse> LoginAsync(LoginDTO loginDto);
        Task<LoginResponse> RegisterAsync(RegisterDTO registerDto);
}