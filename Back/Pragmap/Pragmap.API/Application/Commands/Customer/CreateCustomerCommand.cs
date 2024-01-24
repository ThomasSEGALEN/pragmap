using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;

namespace Pragmap.API.Application.Commands
{
    public class CreateCustommerCommand : IRequest<CommandResult<Customer>>
    {
        public string Name { get; set; }

        public string Logo { get; set; }

        public IEnumerable<Guid>? UserIds { get; set; }
    }
}
