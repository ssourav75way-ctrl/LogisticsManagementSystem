using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using LogisticsBackend.Application.Interfaces.Services;
using LogisticsBackend.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;

namespace EventManagementSystem.Application.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _config;

    public JwtTokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim("sub", user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("name", string.IsNullOrEmpty(user.Name) ? user.Email : user.Name),
            new Claim("role", user.Role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["jwt:key"] ?? "DefaultSecretKeyForDevelopmentOnly"));
        
        var creds = new SigningCredentials(
            key, SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                _config.GetValue<int>("jwt:ExpiryTime")
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}