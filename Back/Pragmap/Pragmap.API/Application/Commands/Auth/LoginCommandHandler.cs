using MediatR;
using Microsoft.IdentityModel.Tokens;
using Pragmap.API.Application.DTOs;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.Repositories.Interfaces;
using Pragmap.Infrastructure.UnitOfWork;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace Pragmap.API.Application.Commands.Auth
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, CommandResult<AuthTokensDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        public LoginCommandHandler(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }
        public Task<CommandResult<AuthTokensDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            if (!User.IsValidEmail(request.Email))
            {
                return Task.FromResult(CommandResult<AuthTokensDto>.Failed("Le format de l'adresse mail est invalide"));
            }

            IBaseRepository<User> userRepository = _unitOfWork.GetRepository<User>();
            string passwordHash = User.HashPassword(request.Password);
            User? user = userRepository.Single(u => u.Email.Equals(request.Email) && u.PasswordHash.Equals(passwordHash));
            
            if(user == null)
            {
                return Task.FromResult(CommandResult<AuthTokensDto>.Failed("Adresse mail ou mot de passe incorrect"));
            }

            var authClaims = new List<Claim>
            {
               new Claim(ClaimTypes.Name, string.Format("{0} {1}", user.FirstName, user.LastName)),
               new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
               new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            if (user.UserRoles != null && user.UserRoles.Any())
            {
                foreach (var userRole in user.UserRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));
                }
            }
            string token = GenerateToken(authClaims);
            string refreshToken = Guid.NewGuid().ToString();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddMonths(6);

            userRepository.Update(user);
            _unitOfWork.Complete().Wait();

            var tokenDto = new AuthTokensDto
            {
                AccessToken = token,
                RefreshToken = refreshToken
            };
            return Task.FromResult(CommandResult<AuthTokensDto>.Success(tokenDto));
        }
        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTKey:Secret"]));
            var tokenExpiryTimeInHour = Convert.ToInt64(_configuration["JWTKey:TokenExpiryTimeInHour"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _configuration["JWTKey:ValidIssuer"],
                Audience = _configuration["JWTKey:ValidAudience"],
                Expires = DateTime.UtcNow.AddHours(tokenExpiryTimeInHour),
                SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
                Subject = new ClaimsIdentity(claims)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
