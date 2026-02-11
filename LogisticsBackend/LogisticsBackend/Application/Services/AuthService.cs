
using LogisticsBackend.Application.DTO.AuthDTO_s;
using LogisticsBackend.Application.Interfaces.Repository;
using LogisticsBackend.Application.Interfaces.Services;
using LogisticsBackend.Domain.Entities;

namespace EventManagementSystem.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthService(
            IAuthRepository authRepository,
            IJwtTokenService jwtTokenService)
        {
            _authRepository = authRepository;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<LoginResponse> LoginAsync(LoginDTO loginDto)
        {
            if (loginDto == null) throw new Exception("Login data is required.");
            if (string.IsNullOrWhiteSpace(loginDto.Email)) throw new Exception("Email is required.");
            if (string.IsNullOrWhiteSpace(loginDto.Password)) throw new Exception("Password is required.");

            var existingUser = await _authRepository.GetUserByEmail(loginDto.Email);
            if (existingUser == null || existingUser.Password != loginDto.Password) 
                throw new UnauthorizedAccessException("Invalid credentials.");

            return new LoginResponse 
            { 
                Token = _jwtTokenService.GenerateToken(existingUser),
                Role = existingUser.Role 
            };
        }

        public async Task<LoginResponse> RegisterAsync(RegisterDTO registerDto)
        {
            if (registerDto == null) throw new Exception("Registration data is required.");
            if (string.IsNullOrWhiteSpace(registerDto.Name)) throw new Exception("Name is required.");
            if (string.IsNullOrWhiteSpace(registerDto.Email)) throw new Exception("Email is required.");
            if (string.IsNullOrWhiteSpace(registerDto.Password)) throw new Exception("Password is required.");

            var existingUser = await _authRepository.GetUserByEmail(registerDto.Email);
            if (existingUser != null)
                throw new Exception("User already exists.");

            var user = new User 
            { 
                Name = registerDto.Name,
                Email = registerDto.Email, 
                Password = registerDto.Password,
                Role = registerDto.Role ?? "DRIVER",
                
            };

            var createdUser = await _authRepository.CreateUser(user);
            return new LoginResponse 
            { 
                Token = _jwtTokenService.GenerateToken(createdUser),
                Role = createdUser.Role 
            };
        }
    }
}