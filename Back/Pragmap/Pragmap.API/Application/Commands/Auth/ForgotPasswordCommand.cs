using MediatR;
using Pragmap.API.Application.Models;

namespace Pragmap.API.Application.Commands.Auth
{
    public class ForgotPasswordCommand : IRequest<CommandResult>
    {
        public string Email { get; set; }
    }
}
