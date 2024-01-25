using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, CommandResult<User>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateUserCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<CommandResult<User>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {

            var userRepo = _unitOfWork.GetRepository<User>();
            var user = userRepo.Single(request.Id);

            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.RoleId = request.RoleId.Value;

            userRepo.Update(user);
            await _unitOfWork.Complete();

            return CommandResult<User>.Success(user);

        }
    }
}
