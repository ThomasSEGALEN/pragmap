using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;

namespace Pragmap.API.Application.Commands
{
    public class CreateRoadmapCommand : IRequest<CommandResult<Roadmap>>
    {
        public string Name { get; set; }
        public Guid CustomerId { get; set; }
    }
}
