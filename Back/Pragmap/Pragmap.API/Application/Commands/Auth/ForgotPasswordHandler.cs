using MediatR;
using Pragmap.API.Application.Helpers;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.Mail;
using Pragmap.Infrastructure.Mail.Service;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands.Auth
{
    public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, CommandResult>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;

        public ForgotPasswordHandler(IUnitOfWork unitOfWork, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _mailService = mailService;
        }
        public Task<CommandResult> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return Task.FromResult(CommandResult.Failed("L'email doit être renseigné."));
            }

            if(!ValidationHelper.IsValidEmail(request.Email))
            {
                return Task.FromResult(CommandResult.Failed("L'email n'est pas valide."));
            }

            var userRepository = _unitOfWork.GetRepository<User>();
            var user = userRepository.Single(x => x.Email == request.Email);

            if(user == null)
            {
                return Task.FromResult(CommandResult.Success());
            }

            var resetPasswordToken = new ResetPasswordToken
            {
            UserId = user.Id,
            Token = Guid.NewGuid(),
            TokenExpiresAt = DateTime.UtcNow.AddHours(1)
            };

            _unitOfWork.GetRepository<ResetPasswordToken>().Add(resetPasswordToken);
            _unitOfWork.Complete();

            var mailData = new MailData
            {
                EmailToId = user.Email,
                EmailToName = $"{user.FirstName} {user.LastName}",
                EmailSubject = ResetPasswordToken.MailSubject,
                EmailBody = ResetPasswordToken.GetMailBody(resetPasswordToken.Token)
            };

            var mailSended = _mailService.SendMail(mailData);
            if(!mailSended)
            {
                return Task.FromResult(CommandResult.Failed("Une erreur s'est produite lors de l'envoi du mail"));
            }
            
            return Task.FromResult(CommandResult.Success());
        }
    }
}
