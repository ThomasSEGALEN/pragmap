﻿using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Pragmap.API.Application.Commands;
using Pragmap.API.Application.Commands.Controller;
using Pragmap.Controllers.Entities;
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

        public async Task<IActionResult> Post([FromBody] CreateCustommerCommand createCustomerCommand)
        {
            var result = await _mediatR.Send(createCustomerCommand);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }

        public async Task<IActionResult> Put(Guid key, [FromBody] UpdateCustomerCommand updateCustomerCommand)
        {
            var result = await _mediatR.Send(updateCustomerCommand);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }

        public async Task<IActionResult> Delete([FromRoute] Guid key)
        {
            var customerRepository = _unitOfWork.GetRepository<Customer>();
            Customer? customer = customerRepository.Single(u => u.Id.Equals(key));
            if (customer == null)
            {
                return BadRequest();
            }
            customerRepository.Delete(customer);
            await _unitOfWork.Complete();
            return NoContent();
        }
    }
}
