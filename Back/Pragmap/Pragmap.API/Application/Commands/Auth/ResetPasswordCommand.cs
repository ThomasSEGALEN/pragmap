using MediatR;
using Pragmap.API.Application.Models;

namespace Pragmap.API.Application.Commands.Auth
{
    public class ResetPasswordCommand : IRequest<CommandResult>
    {
        public Guid Token { get; set; }
        public string Password { get; set; }
    }
}
