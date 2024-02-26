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

        public async Task<IActionResult> Post([FromBody] CreateUserCommand createUserCommand)
        {
            var result = await _mediatR.Send(createUserCommand);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }

        [HttpPost("[controller]/ask-email-update")]
        public async Task<IActionResult> AskMailUpdate([FromBody] AskEmailUpdateCommand askMailUpdateCommand)
        {
            var result = await _mediatR.Send(askMailUpdateCommand);
            _unitOfWork.Complete();
            if (result.IsSuccess)
            {
                return Ok();
            }
            return BadRequest(result.Error);
        }

        public async Task<IActionResult> Put(Guid key, [FromBody] UpdateUserCommand updateUserCommand)
        {
            var result = await _mediatR.Send(updateUserCommand);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }

        [HttpPut("[controller]/{key}/update-password")]
        public async Task<IActionResult> UpdatePassword(Guid key, [FromBody] UpdatePasswordCommand changePasswordCommand)
        {
            var result = await _mediatR.Send(changePasswordCommand);
            await _unitOfWork.Complete();
            if (result.IsSuccess)
            {
                return Ok();
            }
            return BadRequest(result.Error);
        }

        [HttpPost("[controller]/update-email")]
        public async Task<IActionResult> UpdateEmail([FromQuery] Guid token)
        {
            var updateEmailCommand = new UpdateEmailCommand { Token = token };
            var result = await _mediatR.Send(updateEmailCommand);
            await _unitOfWork.Complete();
            if (result.IsSuccess)
            {
                return Ok();
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
