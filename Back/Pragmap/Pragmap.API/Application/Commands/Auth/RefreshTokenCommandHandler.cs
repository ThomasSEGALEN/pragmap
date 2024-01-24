using MediatR;
using Pragmap.API.Application.DTOs;
using Pragmap.API.Application.Helpers;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Infrastructure.Repositories.Interfaces;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands.Auth
{
    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, CommandResult<string>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public RefreshTokenCommandHandler(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }
        public Task<CommandResult<string>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
               IBaseRepository<User> userRepository = _unitOfWork.GetRepository<User>();
                User? user = userRepository.Single(u => u.RefreshToken.Equals(request.RefreshToken));
    
                if (user == null)
                {
                    return Task.FromResult(CommandResult<string>.Failed("Le jeton de rafraîchissement est invalide"));
                }
    
                if (user.RefreshTokenExpiresAt < DateTime.UtcNow)
                {
                    return Task.FromResult(CommandResult<string>.Failed("Le jeton de rafraîchissement a expiré"));
                }
    
                string token = AuthTokenHelper.GenerateToken(_configuration, user);
    
                return Task.FromResult(CommandResult<string>.Success(token));
        }
    }
}
