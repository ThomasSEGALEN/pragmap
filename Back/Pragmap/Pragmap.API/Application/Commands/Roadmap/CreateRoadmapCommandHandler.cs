using MediatR;
using Microsoft.IdentityModel.Tokens;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class CreateRoadmapCommandHandler : IRequestHandler<CreateRoadmapCommand, CommandResult<Roadmap>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public CreateRoadmapCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<CommandResult<Roadmap>> Handle(CreateRoadmapCommand request, CancellationToken cancellationToken)
        {
            if(request.Name.IsNullOrEmpty())
            {
                return Task.FromResult(CommandResult<Roadmap>.Failed("Une roadmap doit porter un nom"));
            }

            if(request.CustomerId.Equals(Guid.Empty))
            {
                return Task.FromResult(CommandResult<Roadmap>.Failed("Une roadmap doit être associée à un client"));
            }

            var customer = _unitOfWork.GetRepository<Customer>().Single(request.CustomerId);
            if(customer == null)
            {
                return Task.FromResult(CommandResult<Roadmap>.Failed("Le client associé à la roadmap n'existe pas"));
            }

            var roadmap = new Roadmap
            {
                Name = request.Name,
                CustomerId = request.CustomerId
            };
            try
            {
                _unitOfWork.GetRepository<Roadmap>().Add(roadmap);
            } catch (Exception e)
            {
                return Task.FromResult(CommandResult<Roadmap>.Failed(e.Message));
            }

            return Task.FromResult(CommandResult<Roadmap>.Success(roadmap)); 
        }
    }
}
