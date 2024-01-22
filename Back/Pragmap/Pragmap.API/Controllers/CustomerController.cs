using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Pragmap.API.Application.Commands;
using Pragmap.API.Application.Commands.Controller;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Controllers
{
    public class CustomerController : ODataController
    {
        private readonly IMediator _mediatR;
        private readonly IUnitOfWork _unitOfWork;

        public CustomerController(IMediator mediatR, IUnitOfWork unitOfWork)
        {
            _mediatR = mediatR;
            _unitOfWork = unitOfWork;
        }

        [EnableQuery]
        public IQueryable<Customer> Get()
        {
            return _unitOfWork.GetRepository<Customer>().GetAll();
        }

        [EnableQuery]
        public Customer? Get([FromRoute] Guid key)
        {
            return _unitOfWork.GetRepository<Customer>().Single(key);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateCustommerCommand createCustomerCommand)
        {
            var result = await _mediatR.Send(createCustomerCommand);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] UpdateCustomerCommand updateCustomerCommand)
        {
            var result = await _mediatR.Send(updateCustomerCommand);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }
    }
}
