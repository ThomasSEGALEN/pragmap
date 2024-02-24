using MediatR;
using Microsoft.EntityFrameworkCore;
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

            if (customer == null)
            {
                return CommandResult<Customer>.Failed("Ce client n'éxiste pas");
            }

            if (request.UserIds != null)
            {
                var existingUserIds = customer?.CustomerUsers?.Select(cu => cu.UserId).ToList();

                var usersToRemove = customer?.CustomerUsers?.Where(cu => !request.UserIds.Contains(cu.UserId)).ToList();
                foreach (var userToRemove in usersToRemove)
                {
                    _unitOfWork.GetRepository<CustomerUser>().Delete(userToRemove);
                }

                var newUserIds = request.UserIds.Where(id => !existingUserIds.Contains(id)).ToList();
                foreach (var userId in newUserIds)
                {
                    customer.CustomerUsers.Add(new CustomerUser
                    {
                        UserId = userId,
                        CustomerId = customer.Id,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    });
                }
            }

            if (request.Name != null)
            {
                customer!.Name = request.Name;
            }
            if(request.Logo != null)
            {
                customer!.Logo = request.Logo;
            }

            customerRepo.Update(customer!);
            await _unitOfWork.Complete();

            return CommandResult<Customer>.Success(customer!);
        }
    }
}
