using MediatR;
using Microsoft.IdentityModel.Tokens;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class CreateRoadMapCommandHandler : IRequestHandler<CreateRoadMapCommand, CommandResult<RoadMap>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public CreateRoadMapCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<CommandResult<RoadMap>> Handle(CreateRoadMapCommand request, CancellationToken cancellationToken)
        {
            if(request.Name.IsNullOrEmpty())
            {
                return Task.FromResult(CommandResult<RoadMap>.Failed("Une roadmap doit porter un nom"));
            }

            if(request.CustomerId.Equals(Guid.Empty))
            {
                return Task.FromResult(CommandResult<RoadMap>.Failed("Une roadmap doit être associée à un client"));
            }

            var customer = _unitOfWork.GetRepository<Customer>().Single(request.CustomerId);
            if(customer == null)
            {
                return Task.FromResult(CommandResult<RoadMap>.Failed("Le client associé à la roadmap n'existe pas"));
            }

            var roadmap = new RoadMap
            {
                Name = request.Name,
                CustomerId = request.CustomerId
            };
            try
            {
                _unitOfWork.GetRepository<RoadMap>().Add(roadmap);
            } catch (Exception e)
            {
                return Task.FromResult(CommandResult<RoadMap>.Failed(e.Message));
            }

            return Task.FromResult(CommandResult<RoadMap>.Success(roadmap)); 
        }
    }
}
