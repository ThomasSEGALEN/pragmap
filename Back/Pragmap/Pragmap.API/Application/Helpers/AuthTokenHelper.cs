using Microsoft.IdentityModel.Tokens;
using Pragmap.Controllers.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Pragmap.API.Application.Helpers
{
    public class AuthTokenHelper
    {
        public static string GenerateToken(IConfiguration configuration, User user)
        {
            var claims = CreateClaims(user);
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWTKey:Secret"]));
            var tokenExpiryTimeInHour = Convert.ToInt64(configuration["JWTKey:TokenExpiryTimeInHour"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = configuration["JWTKey:ValidIssuer"],
                Audience = configuration["JWTKey:ValidAudience"],
                Expires = DateTime.UtcNow.AddHours(tokenExpiryTimeInHour),
                SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
                Subject = new ClaimsIdentity(claims)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        private static List<Claim> CreateClaims(User? user)
        {
            return new List<Claim>
            {
               new Claim(ClaimTypes.Name, string.Format("{0} {1}", user.FirstName, user.LastName)),
               new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
               new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
               new Claim(ClaimTypes.Role, user.Role.Name)
            };
        }
    }
}
