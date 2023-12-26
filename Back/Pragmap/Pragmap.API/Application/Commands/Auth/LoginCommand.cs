using MediatR;
using Pragmap.API.Application.DTOs;
using Pragmap.API.Application.Models;

namespace Pragmap.API.Application.Commands.Auth
{
    public class LoginCommand : IRequest<CommandResult<AuthTokensDto>>
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
