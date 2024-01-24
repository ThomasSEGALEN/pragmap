using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class CreateCustomerCommandHandler : IRequestHandler<CreateCustommerCommand, CommandResult<Customer>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateCustomerCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<CommandResult<Customer>> Handle(CreateCustommerCommand request, CancellationToken cancellationToken)
        {   
            var now = DateTime.Now;
            var customer = new Customer
            {
                Name = request.Name,
                Logo = request.Logo,
            };

            if (request.UserIds != null)
            {
                customer.CustomerUsers = request.UserIds.Select(id => new CustomerUser { UserId = id, CustomerId = customer.Id, CreatedAt = now, UpdatedAt = now }).ToList();
            }
            _unitOfWork.GetRepository<Customer>().Add(customer);
            await _unitOfWork.Complete();

            return CommandResult<Customer>.Success(customer);
        }   
    }
}
