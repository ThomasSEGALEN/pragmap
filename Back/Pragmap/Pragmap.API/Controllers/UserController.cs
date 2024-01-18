using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Pragmap.API.Application.Commands;
using Pragmap.Controllers.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Controllers
{
    public class UserController : ODataController
    {
        private readonly IMediator _mediatR;
        private readonly IUnitOfWork _unitOfWork;
        public UserController(IMediator mediatR, IUnitOfWork unitOfWork)
        {
            _mediatR = mediatR;
            _unitOfWork = unitOfWork;
        }

        [EnableQuery]
        public IEnumerable<User> Get()
        {
            return _unitOfWork.GetRepository<User>().GetAll();
        }

        [EnableQuery]
        public User? Get([FromRoute] Guid key)
        {
            return _unitOfWork.GetRepository<User>().Single(key);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateUserCommand createUserCommand)
        {
            var result = await _mediatR.Send(createUserCommand);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }

        public async Task<IActionResult> Delete([FromRoute] Guid key)
        {
            var userRepository = _unitOfWork.GetRepository<User>();
            User? user = userRepository.Single(u => u.Id.Equals(key));
            if (user == null)
            {
                return BadRequest();
            }
            userRepository.Delete(user);
            await _unitOfWork.Complete();
            return NoContent();
        }
    }
}
