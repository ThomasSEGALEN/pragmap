using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class UpdateRoadmapCommandHandler : IRequestHandler<UpdateRoadmapCommand, CommandResult<Roadmap>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public UpdateRoadmapCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public Task<CommandResult<Roadmap>> Handle(UpdateRoadmapCommand request, CancellationToken cancellationToken)
        {
            if (request.Id.Equals(Guid.Empty))
            {
                return Task.FromResult(CommandResult<Roadmap>.Failed("La roadmap doit avoir un identifiant"));
            }

            var roadMapRepository = _unitOfWork.GetRepository<Roadmap>();

            var roadmap = roadMapRepository.Single(request.Id);
            if (roadmap == null)
            {
                return Task.FromResult(CommandResult<Roadmap>.Failed("La roadmap n'existe pas"));
            }

            roadmap.Name = request.Name ?? roadmap.Name;
            roadmap.Data = request.Data ?? roadmap.Data;

            try
            {
                _unitOfWork.GetRepository<Roadmap>().Update(roadmap);
            }
            catch (Exception e)
            {
                return Task.FromResult(CommandResult<Roadmap>.Failed(e.Message));
            }

            return Task.FromResult(CommandResult<Roadmap>.Success(roadmap));
        }
    }
}
