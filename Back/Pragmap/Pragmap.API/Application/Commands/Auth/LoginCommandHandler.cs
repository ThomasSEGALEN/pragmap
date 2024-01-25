using MediatR;
using Microsoft.IdentityModel.Tokens;
using Pragmap.API.Application.DTOs;
using Pragmap.API.Application.Helpers;
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
            if (!ValidationHelper.IsValidEmail(request.Email))
            {
                return Task.FromResult(CommandResult<AuthTokensDto>.Failed("Le format de l'adresse e-mail est invalide"));
            }

            IBaseRepository<User> userRepository = _unitOfWork.GetRepository<User>();
            string passwordHash = User.HashPassword(request.Password);
            User? user = userRepository.Single(u => u.Email.Equals(request.Email) && u.PasswordHash.Equals(passwordHash));

            if (user == null)
            {
                return Task.FromResult(CommandResult<AuthTokensDto>.Failed("Adresse e-mail ou mot de passe incorrect"));
            }

            string token = AuthTokenHelper.GenerateToken(_configuration, user);
            string refreshToken = Guid.NewGuid().ToString();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddMonths(6);

            userRepository.Update(user);
            _unitOfWork.Complete().Wait();

            var tokenDto = new AuthTokensDto
            {
                AccessToken = token,
                RefreshToken = refreshToken
            };
            return Task.FromResult(CommandResult<AuthTokensDto>.Success(tokenDto));
        }
    }
}
