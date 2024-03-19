using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;

namespace Pragmap.API.Application.Commands
{
    public class UpdateRoadmapCommand : IRequest<CommandResult<Roadmap>>
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Data { get; set; }
    }
}
