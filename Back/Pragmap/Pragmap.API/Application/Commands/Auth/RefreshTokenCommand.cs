using MediatR;
using Pragmap.API.Application.DTOs;
using Pragmap.API.Application.Models;

namespace Pragmap.API.Application.Commands.Auth
{
    public class RefreshTokenCommand : IRequest<CommandResult<string>>
    {
        public string RefreshToken { get; set; }
    }
}
