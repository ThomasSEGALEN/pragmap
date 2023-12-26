using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pragmap.API.Application.Commands;
using Pragmap.Controllers.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly IMediator _mediatR;
        private readonly IUnitOfWork _unitOfWork;
        public UserController(IMediator mediatR, IUnitOfWork unitOfWork)
        {
            _mediatR = mediatR;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            return _unitOfWork.GetRepository<User>().GetAll();
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userRepository = _unitOfWork.GetRepository<User>();
            User? user = userRepository.Single(u => u.Id.Equals(id));
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
