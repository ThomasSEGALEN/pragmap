using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class UpdateRoadMapCommandHandler : IRequestHandler<UpdateRoadMapCommand, CommandResult<RoadMap>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public UpdateRoadMapCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public Task<CommandResult<RoadMap>> Handle(UpdateRoadMapCommand request, CancellationToken cancellationToken)
        {
            if (request.Id.Equals(Guid.Empty))
            {
                return Task.FromResult(CommandResult<RoadMap>.Failed("La roadmap doit avoir un identifiant"));
            }

            var roadMapRepository = _unitOfWork.GetRepository<RoadMap>();

            var roadmap = roadMapRepository.Single(request.Id);
            if (roadmap == null)
            {
                return Task.FromResult(CommandResult<RoadMap>.Failed("La roadmap n'existe pas"));
            }

            roadmap.Name = request.Name ?? roadmap.Name;
            roadmap.Data = request.Data ?? roadmap.Data;

            try
            {
                _unitOfWork.GetRepository<RoadMap>().Update(roadmap);
            }
            catch (Exception e)
            {
                return Task.FromResult(CommandResult<RoadMap>.Failed(e.Message));
            }

            return Task.FromResult(CommandResult<RoadMap>.Success(roadmap));
        }
    }
}
