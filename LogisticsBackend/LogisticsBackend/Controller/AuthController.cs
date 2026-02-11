using LogisticsBackend.Application.DTO.AuthDTO_s;
using LogisticsBackend.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsBackend.Controller;


    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO  logindto )
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var dto = new LoginDTO
                {
                    Email = logindto.Email,
                    Password = logindto.Password
                };
                var response = await _authService.LoginAsync(dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var dto = new RegisterDTO
                {
                    Name = registerDto.Name,
                    Email = registerDto.Email,
                    Password = registerDto.Password,
                    Role = registerDto.Role
                };
                var response = await _authService.RegisterAsync(dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
