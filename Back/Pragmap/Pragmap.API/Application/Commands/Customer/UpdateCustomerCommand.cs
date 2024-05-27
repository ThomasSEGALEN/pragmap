using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;

namespace Pragmap.API.Application.Commands.Controller
{
    public class UpdateCustomerCommand : IRequest<CommandResult<Customer>>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public string? Logo { get; set; }

        public IEnumerable<Guid> UserIds { get; set; }
    }
}
