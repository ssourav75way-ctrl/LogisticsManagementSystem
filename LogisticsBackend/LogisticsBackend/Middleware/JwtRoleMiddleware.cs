using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LogisticsBackend.Application.Interfaces.Services;
using Microsoft.IdentityModel.Tokens;

namespace LogisticsBackend.Middleware
{
    public class JwtRoleMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _jwtKey;

        public JwtRoleMiddleware(RequestDelegate next, IConfiguration config)
        {
            _next = next;
            _jwtKey = config["jwt:key"] ?? throw new ArgumentNullException("JWT Key is missing");
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (string.IsNullOrEmpty(token))
            {
                token = context.Request.Cookies["JwtToken"];
            }

            if (!string.IsNullOrEmpty(token))
            {
                AttachUserToContext(context, token);
            }

            await _next(context);
        }

        private void AttachUserToContext(HttpContext context, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_jwtKey);
                
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var claimsIdentity = new ClaimsIdentity(jwtToken.Claims, "Jwt", "name", "role");
                context.User = new ClaimsPrincipal(claimsIdentity);
            }

            catch
            {
                context.Response.Cookies.Delete("JwtToken");
            }
        }
    }

    public static class JwtRoleMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtRoleMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JwtRoleMiddleware>();
        }
    }
}