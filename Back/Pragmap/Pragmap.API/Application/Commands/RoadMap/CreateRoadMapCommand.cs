using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;

namespace Pragmap.API.Application.Commands
{
    public class CreateRoadMapCommand : IRequest<CommandResult<RoadMap>>
    {
        public string Name { get; set; }
        public Guid CustomerId { get; set; }
    }
}
