using MediatR;
using Pragmap.API.Application.Models;

namespace Pragmap.API.Application.Commands
{
    public class UpdateEmailCommand : IRequest<CommandResult>
    {
        public Guid Token { get; set; }
    }
}
