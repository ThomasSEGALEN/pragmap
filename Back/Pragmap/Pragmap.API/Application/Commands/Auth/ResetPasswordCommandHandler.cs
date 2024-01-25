using MediatR;
using Pragmap.API.Application.Helpers;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands.Auth
{
    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, CommandResult>
    {
        private readonly IUnitOfWork _unitOfWork;
        public ResetPasswordCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public Task<CommandResult> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            if (request.Token == Guid.Empty)
            {
                return Task.FromResult(CommandResult.Failed("Le token doit être renseigné."));
            }

            if (string.IsNullOrEmpty(request.Password))
            {
                return Task.FromResult(CommandResult.Failed("Le mot de passe doit être renseigné."));
            }

            if(!ValidationHelper.IsValidPassword(request.Password))
            {
                return Task.FromResult(CommandResult.Failed("Le mot de passe doit contenir au moins 6 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial."));
            }

            var resetPasswordTokenRepository = _unitOfWork.GetRepository<ResetPasswordToken>();
            var resetPasswordToken = resetPasswordTokenRepository.Single(x => x.Token.Equals(request.Token));

            if (resetPasswordToken == null)
            {
                return Task.FromResult(CommandResult.Failed("Le token n'est pas valide."));
            }

            if (resetPasswordToken.TokenExpiresAt < DateTime.UtcNow)
            {
                return Task.FromResult(CommandResult.Failed("Le token a expiré."));
            }

            resetPasswordToken.User.PasswordHash = User.HashPassword(request.Password);
            _unitOfWork.GetRepository<User>().Update(resetPasswordToken.User);

            resetPasswordTokenRepository.Delete(resetPasswordToken);

            _unitOfWork.Complete().Wait();

            return Task.FromResult(CommandResult.Success());
        }
    }
}
