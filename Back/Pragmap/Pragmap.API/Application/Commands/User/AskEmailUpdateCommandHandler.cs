using MediatR;
using Pragmap.API.Application.Helpers;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.Mail;
using Pragmap.Infrastructure.Mail.Service;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class AskEmailUpdateCommandHandler : IRequestHandler<AskEmailUpdateCommand, CommandResult>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;
        public AskEmailUpdateCommandHandler(IUnitOfWork unitOfWork, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _mailService = mailService;
        }

        public Task<CommandResult> Handle(AskEmailUpdateCommand request, CancellationToken cancellationToken)
        {
            if(request.UserId == Guid.Empty)
            {
                return Task.FromResult(CommandResult.Failed("L'idendifiant de l'utilisateur est requis"));
            }

            if(string.IsNullOrEmpty(request.Email))
            {
                return Task.FromResult(CommandResult.Failed("L'email est requis"));
            }

            if(!ValidationHelper.IsValidEmail(request.Email))
            {
                return Task.FromResult(CommandResult.Failed("L'email n'est pas valide"));
            }

            var user = _unitOfWork.GetRepository<User>().Single(request.UserId);

            if(user == null)
            {
                return Task.FromResult(CommandResult.Failed("L'utilisateur n'existe pas"));
            }

            if(user.Email.Equals(request.Email))
            {
                return Task.FromResult(CommandResult.Failed("L'email est identique à l'ancienne adresse"));
            }

            if(_unitOfWork.GetRepository<User>().Any(u => u.Email.Equals(request.Email)))
            {
                return Task.FromResult(CommandResult.Failed("L'email est déjà utilisé par un autre utilisateur"));
            }

            var token = new UpdateEmailToken
            {
                UserId = user.Id,
                Token = Guid.NewGuid(),
                TokenExpiresAt = DateTime.Now.AddHours(1),
                NewEmail = request.Email,
                OldEmail = user.Email
            };

            _unitOfWork.GetRepository<UpdateEmailToken>().Add(token);

            var mailData = new MailData
            {
                EmailSubject = UpdateEmailToken.MailSubject,
                EmailBody = UpdateEmailToken.GetMailBody(token.NewEmail, token.Token),
                EmailToId = user.Email,
                EmailToName = $"{user.FirstName} {user.LastName}"
            };
            _mailService.SendMail(mailData);

            return Task.FromResult(CommandResult.Success());
        }
    }
}
