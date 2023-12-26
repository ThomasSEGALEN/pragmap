using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.Repositories.Interfaces;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, CommandResult<User>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateUserCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<CommandResult<User>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            if(!User.IsValidEmail(request.Email))
            {
                return Task.FromResult(CommandResult<User>.Failed("Le format de l'adresse mail est invalide"));
            }

            if(_unitOfWork.GetRepository<User>().Any(u => u.Email.Equals(request.Email)))
            {
                return Task.FromResult(CommandResult<User>.Failed("Un utilisateur avec cette adresse mail existe déjà"));
            }

            var user = new User
            {
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PasswordHash = User.HashPassword(request.Password),
            };

            user.UserRoles = request.Roles.Select(r => new UserRole { UserId = user.Id, RoleId = r.Id }).ToList();
            _unitOfWork.GetRepository<User>().Add(user);
            _unitOfWork.Complete().Wait();

            return Task.FromResult(CommandResult<User>.Success(user));   
        }
    }
}
