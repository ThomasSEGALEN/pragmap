using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;

namespace Pragmap.API.Application.Commands
{
    public class CreateUserCommand : IRequest<CommandResult<User>>
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Role Role { get; set; }

    }
}
