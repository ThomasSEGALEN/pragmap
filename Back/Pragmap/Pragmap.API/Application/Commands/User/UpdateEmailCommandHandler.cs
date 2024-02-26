using MediatR;
using Pragmap.API.Application.Helpers;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class UpdateEmailCommandHandler : IRequestHandler<UpdateEmailCommand, CommandResult>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateEmailCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<CommandResult> Handle(UpdateEmailCommand request, CancellationToken cancellationToken)
        {

            if(request.Token == Guid.Empty)
            {
                return CommandResult.Failed("Le token est requis");
            }

            var updateEmailTokenRepo = _unitOfWork.GetRepository<UpdateEmailToken>();
            var updateEmailToken = updateEmailTokenRepo.Single(x => x.Token.Equals(request.Token));

            if(updateEmailToken == null)
            {
                return CommandResult.Failed("Le token n'existe pas");
            }

            if(updateEmailToken.TokenExpiresAt < DateTime.Now)
            {
                return CommandResult.Failed("Le token a expiré");
            }

            if(updateEmailToken.TokenUsedAt != null)
            {
                return CommandResult.Failed("Le token a déjà été utilisé");
            }

            var userRepo = _unitOfWork.GetRepository<User>();
            var user = userRepo.Single(updateEmailToken.UserId);

            if(user == null)
            {
                return CommandResult.Failed("L'utilisateur relié au token n'existe pas");
            }

            user.Email = updateEmailToken.NewEmail;
            updateEmailToken.TokenUsedAt = DateTime.Now;

            updateEmailTokenRepo.Update(updateEmailToken);
            userRepo.Update(user);

            return CommandResult.Success();
        }
    }
}
