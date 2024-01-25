using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;

namespace Pragmap.API.Application.Commands
{
    public class UpdateUserCommand : IRequest<CommandResult<User>>
    {
        public Guid Id { get; set; }
        public string Email { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Guid? RoleId { get; set; }    
    }
}
