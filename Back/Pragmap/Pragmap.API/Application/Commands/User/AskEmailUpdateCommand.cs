using MediatR;
using Pragmap.API.Application.Models;

namespace Pragmap.API.Application.Commands
{
    public class AskEmailUpdateCommand : IRequest<CommandResult>
    {
        public Guid UserId { get; set; }
        public string Email { get; set; }
    }
}
