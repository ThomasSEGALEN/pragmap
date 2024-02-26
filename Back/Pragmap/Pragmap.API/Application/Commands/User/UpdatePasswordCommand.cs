using MediatR;
using Pragmap.API.Application.Models;

namespace Pragmap.API.Application.Commands
{
    public class UpdatePasswordCommand : IRequest<CommandResult>
    {
        public Guid UserId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
