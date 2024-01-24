using MediatR;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands.Controller
{
    public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, CommandResult<Customer>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateCustomerCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<CommandResult<Customer>> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
        {
            var customerRepo = _unitOfWork.GetRepository<Customer>();
            var customer = customerRepo.Single(request.Id);

            if (request.UserIds != null)
            {
                customer.CustomerUsers = request.UserIds.Select(id => new CustomerUser { UserId = id, CustomerId = customer.Id }).ToList();
            }
            if (request.Name != null)
            {
                customer.Name = request.Name;
            }
            if(request.Logo != null)
            {
                customer.Logo = request.Logo;
            }

            customerRepo.Update(customer);
            await _unitOfWork.Complete();

            return CommandResult<Customer>.Success(customer);
        }
    }
}
